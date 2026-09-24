"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { COLORS, CATEGORY_LABEL, SIZES, type Category, type ColorKey } from "@/lib/products";
import { DROPS, GENDERS, SORTS, toQuery, activeCount, type Filters, type SortKey } from "@/lib/filters";
import { Dialog } from "../Dialog";
import { CloseIcon, ChevronIcon } from "../Icons";
import styles from "./Filters.module.css";

type ListKey = "gender" | "category" | "color" | "size" | "drop";

function useFilterNav() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const go = (next: Filters) =>
    start(() => router.replace(`/shop${toQuery(next)}`, { scroll: false }));
  return { go, pending };
}

function toggle<T>(arr: T[], v: T) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

const EMPTY: Omit<Filters, "sort"> = { gender: [], category: [], color: [], size: [], drop: [] };

export function FilterPanel({ filters, onDone }: { filters: Filters; onDone?: () => void }) {
  const { go, pending } = useFilterNav();
  const set = (key: ListKey, value: string) =>
    go({ ...filters, [key]: toggle(filters[key] as string[], value) } as Filters);

  const groups: { key: ListKey; title: string; options: { value: string; label: string }[] }[] = [
    { key: "gender", title: "Gender", options: GENDERS },
    {
      key: "category",
      title: "Category",
      options: (Object.keys(CATEGORY_LABEL) as Category[]).map((c) => ({ value: c, label: CATEGORY_LABEL[c] })),
    },
    { key: "size", title: "Size", options: SIZES.map((s) => ({ value: s, label: s })) },
    { key: "drop", title: "Drop", options: [...DROPS] },
  ];

  return (
    <div className={styles.panel} data-pending={pending}>
      {groups.slice(0, 2).map((g) => (
        <Group key={g.key} title={g.title}>
          <div className={styles.chips}>
            {g.options.map((o) => (
              <Chip key={o.value} active={(filters[g.key] as string[]).includes(o.value)} onClick={() => set(g.key, o.value)}>
                {o.label}
              </Chip>
            ))}
          </div>
        </Group>
      ))}

      <Group title="Colour">
        <div className={styles.colors}>
          {(Object.keys(COLORS) as ColorKey[]).map((c) => {
            const active = filters.color.includes(c);
            return (
              <button
                key={c}
                type="button"
                className={styles.color}
                aria-pressed={active}
                onClick={() => set("color", c)}
              >
                <span className={styles.sw} style={{ background: COLORS[c].hex }} aria-hidden="true" />
                {COLORS[c].name}
              </button>
            );
          })}
        </div>
      </Group>

      {groups.slice(2).map((g) => (
        <Group key={g.key} title={g.title}>
          <div className={styles.chips}>
            {g.options.map((o) => (
              <Chip key={o.value} active={(filters[g.key] as string[]).includes(o.value)} onClick={() => set(g.key, o.value)}>
                {o.label}
              </Chip>
            ))}
          </div>
          {g.key === "size" && <p className={styles.hint}>Shows pieces in stock in that size</p>}
        </Group>
      ))}

      {onDone && (
        <div className={styles.done}>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={!activeCount(filters)}
            onClick={() => go({ ...filters, ...EMPTY })}
          >
            Reset
          </button>
          <button type="button" className="btn btn-primary" onClick={onDone}>
            Show results
          </button>
        </div>
      )}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className={styles.group}>
      <h2>
        <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={styles.groupBtn}>
          {title}
          <ChevronIcon width={16} height={16} />
        </button>
      </h2>
      <div className={styles.groupBody} hidden={!open}>
        {children}
      </div>
    </section>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className={styles.chip} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  );
}

export function ActiveChips({ filters }: { filters: Filters }) {
  const { go } = useFilterNav();
  const chips: { key: ListKey; value: string; label: string }[] = [
    ...filters.gender.map((v) => ({ key: "gender" as const, value: v, label: GENDERS.find((g) => g.value === v)!.label })),
    ...filters.category.map((v) => ({ key: "category" as const, value: v, label: CATEGORY_LABEL[v] })),
    ...filters.color.map((v) => ({ key: "color" as const, value: v, label: COLORS[v].name })),
    ...filters.size.map((v) => ({ key: "size" as const, value: v, label: `Size ${v}` })),
    ...filters.drop.map((v) => ({ key: "drop" as const, value: v, label: DROPS.find((d) => d.value === v)!.label })),
  ];
  if (!chips.length) return null;
  return (
    <ul className={styles.active} aria-label="Active filters">
      {chips.map((c) => (
        <li key={`${c.key}-${c.value}`}>
          <button
            type="button"
            className={styles.activeChip}
            aria-label={`Remove filter ${c.label}`}
            onClick={() => go({ ...filters, [c.key]: (filters[c.key] as string[]).filter((x) => x !== c.value) } as Filters)}
          >
            {c.label}
            <CloseIcon width={14} height={14} />
          </button>
        </li>
      ))}
      <li>
        <button type="button" className={styles.clear} onClick={() => go({ ...filters, ...EMPTY })}>
          Clear all
        </button>
      </li>
    </ul>
  );
}

export function SortSelect({ filters }: { filters: Filters }) {
  const { go } = useFilterNav();
  return (
    <label className={styles.sort}>
      <span className="sr-only">Sort by</span>
      <select
        value={filters.sort}
        onChange={(e) => go({ ...filters, sort: e.target.value as SortKey })}
        className={styles.select}
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <ChevronIcon width={16} height={16} />
    </label>
  );
}

export function MobileFilters({ filters, count }: { filters: Filters; count: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={styles.mobileBtn} onClick={() => setOpen(true)}>
        Filters{count > 0 && <span className={styles.badge}>{count}</span>}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} className={styles.sheet} label="Filters">
        <div className={styles.sheetHead}>
          <p className={styles.sheetTitle}>Filters</p>
          <button type="button" className={styles.x} onClick={() => setOpen(false)} aria-label="Close filters">
            <CloseIcon />
          </button>
        </div>
        <div className={styles.sheetBody}>
          <FilterPanel filters={filters} onDone={() => setOpen(false)} />
        </div>
      </Dialog>
    </>
  );
}
