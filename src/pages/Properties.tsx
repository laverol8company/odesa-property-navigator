import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";
import {
  PROPERTIES, ALL_DISTRICTS, ALL_TYPES, DistrictKey, PropertyType, DealType,
  FeatureKey, Status,
} from "@/data/properties";
import PropertyCard from "@/components/PropertyCard";
import { openAssistant } from "@/lib/assistantStore";

type SortKey = "newest" | "priceAsc" | "priceDesc" | "areaDesc" | "relevant";

interface Filters {
  deal?: DealType;
  type?: PropertyType;
  districts: DistrictKey[];
  rooms?: number; // 0=studio, 4 means 4+
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  features: FeatureKey[];
  status: Status[];
}

const empty: Filters = { districts: [], features: [], status: [] };

export default function Properties() {
  const { t, locale } = useLang();
  const [params, setParams] = useSearchParams();
  const [f, setF] = useState<Filters>(() => fromParams(params));
  const [sort, setSort] = useState<SortKey>("newest");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [advOpen, setAdvOpen] = useState(false);

  useEffect(() => { setF(fromParams(params)); }, [params]);

  const filtered = useMemo(() => applyFilters(f, sort), [f, sort]);

  const update = (next: Partial<Filters>) => {
    const merged = { ...f, ...next };
    setF(merged);
    setParams(toParams(merged), { replace: true });
  };

  const reset = () => { setF(empty); setParams({}, { replace: true }); };

  const activeChips = buildChips(f, t);

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-secondary/40">
        <div className="container mx-auto container-px py-10 md:py-14">
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary md:text-4xl">{t("props.title")}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{t("props.sub")}</p>
        </div>
      </section>

      <section className="container mx-auto container-px py-8">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block">
            <FiltersPanel f={f} update={update} reset={reset} advOpen={advOpen} setAdvOpen={setAdvOpen} />
          </aside>

          {/* Results column */}
          <div>
            {/* Toolbar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setMobileOpen(true)} className="btn-outline lg:hidden !py-2.5 !text-xs">
                  <Filter className="h-4 w-4" /> {t("props.filters")}
                </button>
                <p className="text-sm font-semibold text-foreground">{t("props.results", { n: filtered.length })}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">{t("props.sort")}:</label>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="appearance-none rounded-md border border-input bg-card py-2 pl-3 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="newest">{t("sort.newest")}</option>
                    <option value="priceAsc">{t("sort.priceAsc")}</option>
                    <option value="priceDesc">{t("sort.priceDesc")}</option>
                    <option value="areaDesc">{t("sort.areaDesc")}</option>
                    <option value="relevant">{t("sort.relevant")}</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>

            {activeChips.length > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {activeChips.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => update(c.remove)}
                    className="chip-active gap-1 hover:opacity-80"
                  >
                    {c.label}
                    <X className="h-3 w-3" />
                  </button>
                ))}
                <button onClick={reset} className="text-xs font-semibold text-muted-foreground underline-offset-2 hover:underline">
                  {t("cta.resetAll")}
                </button>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="card-surface p-10 text-center">
                <SlidersHorizontal className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">{t("props.empty")}</p>
                <div className="mt-5 flex justify-center gap-3">
                  <button onClick={reset} className="btn-outline">{t("cta.resetAll")}</button>
                  <button onClick={openAssistant} className="btn-primary">{t("cta.findProperty")}</button>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => <PropertyCard key={p.id} p={p} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-background animate-fade-in-fast lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <p className="font-display text-lg font-bold text-primary">{t("props.filters")}</p>
            <button aria-label={t("cta.close")} onClick={() => setMobileOpen(false)} className="rounded-md p-2 hover:bg-secondary">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <FiltersPanel f={f} update={update} reset={reset} advOpen={true} setAdvOpen={() => {}} />
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-border bg-background p-4">
            <button onClick={() => { reset(); }} className="btn-outline">{t("cta.resetAll")}</button>
            <button onClick={() => setMobileOpen(false)} className="btn-primary">{t("cta.applyFilters")}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function FiltersPanel({
  f, update, reset, advOpen, setAdvOpen,
}: { f: Filters; update: (n: Partial<Filters>) => void; reset: () => void; advOpen: boolean; setAdvOpen: (v: boolean) => void; }) {
  const { t } = useLang();
  return (
    <div className="space-y-5">
      <Group title={t("fg.main")} defaultOpen>
        <Field label={t("search.deal")}>
          <div className="grid grid-cols-2 gap-2">
            {(["buy","rent"] as DealType[]).map((d) => (
              <Toggle key={d} active={f.deal === d} onClick={() => update({ deal: f.deal === d ? undefined : d })}>{t(`deal.${d}`)}</Toggle>
            ))}
          </div>
        </Field>
        <Field label={t("search.type")}>
          <Select value={f.type ?? ""} onChange={(v) => update({ type: (v || undefined) as PropertyType | undefined })}>
            <option value="">{t("search.any")}</option>
            {ALL_TYPES.map((tp) => <option key={tp} value={tp}>{t(`ptype.${tp}`)}</option>)}
          </Select>
        </Field>
        <Field label={t("search.district")}>
          <Select value={f.districts[0] ?? ""} onChange={(v) => update({ districts: v ? [v as DistrictKey] : [] })}>
            <option value="">{t("search.any")}</option>
            {ALL_DISTRICTS.map((d) => <option key={d} value={d}>{t(`d.${d}`)}</option>)}
          </Select>
        </Field>
        <Field label={t("search.rooms")}>
          <div className="flex flex-wrap gap-1.5">
            {[0,1,2,3,4].map((n) => (
              <Toggle key={n} active={f.rooms === n} onClick={() => update({ rooms: f.rooms === n ? undefined : n })}>
                {n === 0 ? "Studio" : n === 4 ? "4+" : n}
              </Toggle>
            ))}
          </div>
        </Field>
        <Field label={t("search.price")}>
          <div className="grid grid-cols-2 gap-2">
            <input className="input-base" type="number" placeholder={t("search.priceMin")} inputMode="numeric"
              value={f.priceMin ?? ""} onChange={(e) => update({ priceMin: e.target.value ? Number(e.target.value) : undefined })} />
            <input className="input-base" type="number" placeholder={t("search.priceMax")} inputMode="numeric"
              value={f.priceMax ?? ""} onChange={(e) => update({ priceMax: e.target.value ? Number(e.target.value) : undefined })} />
          </div>
        </Field>
      </Group>

      <button
        onClick={() => setAdvOpen(!advOpen)}
        className="flex w-full items-center justify-between rounded-md border border-border bg-card px-4 py-3 text-sm font-semibold hover:bg-secondary"
      >
        <span className="inline-flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" />{t("cta.moreFilters")}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${advOpen ? "rotate-180" : ""}`} />
      </button>

      {advOpen && (
        <div className="space-y-5 animate-fade-in">
          <Group title={t("fg.priceSize")}>
            <Field label={t("search.area") + " (m²)"}>
              <div className="grid grid-cols-2 gap-2">
                <input className="input-base" type="number" placeholder="min" inputMode="numeric"
                  value={f.areaMin ?? ""} onChange={(e) => update({ areaMin: e.target.value ? Number(e.target.value) : undefined })} />
                <input className="input-base" type="number" placeholder="max" inputMode="numeric"
                  value={f.areaMax ?? ""} onChange={(e) => update({ areaMax: e.target.value ? Number(e.target.value) : undefined })} />
              </div>
            </Field>
          </Group>
          <Group title={t("fg.features")}>
            <div className="flex flex-wrap gap-1.5">
              {(["seaview","parking","balcony","renovation","newBuild","furnished","elevator"] as FeatureKey[]).map((ft) => (
                <Toggle key={ft} active={f.features.includes(ft)}
                  onClick={() => update({ features: f.features.includes(ft) ? f.features.filter(x => x !== ft) : [...f.features, ft] })}>
                  {ft === "newBuild" ? t("badge.newBuild") : t(`feat.${ft}`)}
                </Toggle>
              ))}
            </div>
          </Group>
          <Group title={t("fg.status")}>
            <div className="flex flex-wrap gap-1.5">
              {(["available","reserved","sold"] as Status[]).map((s) => (
                <Toggle key={s} active={f.status.includes(s)}
                  onClick={() => update({ status: f.status.includes(s) ? f.status.filter(x => x !== s) : [...f.status, s] })}>
                  {t(`status.${s}`)}
                </Toggle>
              ))}
            </div>
          </Group>
        </div>
      )}

      <button onClick={reset} className="w-full text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground">
        {t("cta.resetAll")}
      </button>
    </div>
  );
}

function Group({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card-surface overflow-hidden">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-4 py-3 text-sm font-bold text-primary">
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="space-y-4 border-t border-border px-4 pb-4 pt-4">{children}</div>}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-base">{label}</label>
      {children}
    </div>
  );
}
function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
        active ? "border-[hsl(var(--teal))] bg-[hsl(var(--teal))] text-white" : "border-border bg-card hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}
function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-md border border-input bg-card py-2.5 pl-3 pr-8 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10">
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function applyFilters(f: Filters, sort: SortKey) {
  let items = PROPERTIES.filter((p) => {
    if (f.deal && p.deal !== f.deal) return false;
    if (f.type && p.type !== f.type) return false;
    if (f.districts.length && !f.districts.includes(p.district)) return false;
    if (f.rooms !== undefined) {
      if (f.rooms === 4 ? p.rooms < 4 : p.rooms !== f.rooms) return false;
    }
    if (f.priceMin !== undefined && p.price < f.priceMin) return false;
    if (f.priceMax !== undefined && p.price > f.priceMax) return false;
    if (f.areaMin !== undefined && p.area < f.areaMin) return false;
    if (f.areaMax !== undefined && p.area > f.areaMax) return false;
    if (f.features.length && !f.features.every((ft) => p.features.includes(ft))) return false;
    if (f.status.length && !f.status.includes(p.status)) return false;
    return true;
  });
  switch (sort) {
    case "priceAsc": items = [...items].sort((a, b) => a.price - b.price); break;
    case "priceDesc": items = [...items].sort((a, b) => b.price - a.price); break;
    case "areaDesc": items = [...items].sort((a, b) => b.area - a.area); break;
    case "newest":
    default: items = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return items;
}

function buildChips(f: Filters, t: (k: string, v?: any) => string) {
  const chips: { id: string; label: string; remove: Partial<Filters> }[] = [];
  if (f.deal) chips.push({ id: "deal", label: t(`deal.${f.deal}`), remove: { deal: undefined } });
  if (f.type) chips.push({ id: "type", label: t(`ptype.${f.type}`), remove: { type: undefined } });
  f.districts.forEach((d) => chips.push({ id: `d-${d}`, label: t(`d.${d}`), remove: { districts: f.districts.filter((x) => x !== d) } }));
  if (f.rooms !== undefined) chips.push({ id: "rooms", label: `${f.rooms === 0 ? "Studio" : f.rooms === 4 ? "4+" : f.rooms} ${t("search.rooms").toLowerCase()}`, remove: { rooms: undefined } });
  if (f.priceMin !== undefined) chips.push({ id: "pmin", label: `≥ €${f.priceMin.toLocaleString()}`, remove: { priceMin: undefined } });
  if (f.priceMax !== undefined) chips.push({ id: "pmax", label: `≤ €${f.priceMax.toLocaleString()}`, remove: { priceMax: undefined } });
  f.features.forEach((ft) => chips.push({ id: `f-${ft}`, label: ft === "newBuild" ? t("badge.newBuild") : t(`feat.${ft}`), remove: { features: f.features.filter((x) => x !== ft) } }));
  f.status.forEach((s) => chips.push({ id: `s-${s}`, label: t(`status.${s}`), remove: { status: f.status.filter((x) => x !== s) } }));
  return chips;
}

function fromParams(p: URLSearchParams): Filters {
  return {
    deal: (p.get("deal") as DealType) || undefined,
    type: (p.get("type") as PropertyType) || undefined,
    districts: (p.get("d")?.split(",").filter(Boolean) as DistrictKey[]) || [],
    rooms: p.get("rooms") ? Number(p.get("rooms")) : undefined,
    priceMin: p.get("pmin") ? Number(p.get("pmin")) : undefined,
    priceMax: p.get("pmax") ? Number(p.get("pmax")) : undefined,
    areaMin: p.get("amin") ? Number(p.get("amin")) : undefined,
    areaMax: p.get("amax") ? Number(p.get("amax")) : undefined,
    features: (p.get("f")?.split(",").filter(Boolean) as FeatureKey[]) || [],
    status: (p.get("s")?.split(",").filter(Boolean) as Status[]) || [],
  };
}
function toParams(f: Filters): Record<string, string> {
  const o: Record<string, string> = {};
  if (f.deal) o.deal = f.deal;
  if (f.type) o.type = f.type;
  if (f.districts.length) o.d = f.districts.join(",");
  if (f.rooms !== undefined) o.rooms = String(f.rooms);
  if (f.priceMin !== undefined) o.pmin = String(f.priceMin);
  if (f.priceMax !== undefined) o.pmax = String(f.priceMax);
  if (f.areaMin !== undefined) o.amin = String(f.areaMin);
  if (f.areaMax !== undefined) o.amax = String(f.areaMax);
  if (f.features.length) o.f = f.features.join(",");
  if (f.status.length) o.s = f.status.join(",");
  return o;
}
