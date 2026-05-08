import { useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight, Check, Search, MessageCircle } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";
import { useAssistant } from "@/lib/assistantStore";
import {
  PROPERTIES, ALL_DISTRICTS, ALL_TYPES, DistrictKey, PropertyType, DealType,
  FeatureKey, PurposeKey, Property,
} from "@/data/properties";
import PropertyCard from "./PropertyCard";
import { Link } from "react-router-dom";

type Answers = {
  deal?: DealType;
  type?: PropertyType;
  district: (DistrictKey | "any")[];
  budget?: [number, number] | "any";
  rooms?: number | "any";
  purpose: PurposeKey[];
  features: FeatureKey[];
};

const initial: Answers = { district: [], purpose: [], features: [] };

export default function PropertyMatchAssistant() {
  const { open, setOpen } = useAssistant();
  const { t, locale } = useLang();
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [contact, setContact] = useState({ name: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Lock scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // reset on open
  useEffect(() => {
    if (open) { setStep(0); setA(initial); setSubmitted(false); setErrors({}); }
  }, [open]);

  const matches = useMemo(() => matchProperties(a), [a]);

  // Steps 2 (district), 5 (purpose), 6 (features) are multiselect → require Next
  const MULTI_STEPS = [2, 5, 6];
  const isMultiStep = MULTI_STEPS.includes(step);

  const autoAdvance = (fn: () => void) => {
    fn();
    setTimeout(() => setStep((s) => s + 1), 220);
  };

  const steps: { key: string; render: () => JSX.Element }[] = [
    {
      key: "deal",
      render: () => (
        <Question title={t("ma.q.deal")}>
          <OptionCards
            options={[
              { v: "buy", label: t("deal.buy"), desc: t("ma.deal.buy.desc") },
              { v: "rent", label: t("deal.rent"), desc: t("ma.deal.rent.desc") },
            ]}
            value={a.deal}
            onChange={(v) => autoAdvance(() => setA({ ...a, deal: v as DealType }))}
          />
        </Question>
      ),
    },
    {
      key: "type",
      render: () => (
        <Question title={t("ma.q.type")}>
          <Pills
            options={ALL_TYPES.map((tp) => ({ v: tp, label: t(`ptype.${tp}`) }))}
            value={a.type}
            onChange={(v) => autoAdvance(() => setA({ ...a, type: v as PropertyType }))}
          />
        </Question>
      ),
    },
    {
      key: "district",
      render: () => (
        <Question title={t("ma.q.district")}>
          <Pills
            multi
            t={t}
            options={[
              ...ALL_DISTRICTS.map((d) => ({ v: d, label: t(`d.${d}`) })),
              { v: "any", label: t("search.notSure") },
            ]}
            value={a.district}
            onChange={(v) => setA({ ...a, district: v as (DistrictKey | "any")[] })}
          />
        </Question>
      ),
    },
    {
      key: "budget",
      render: () => {
        const budgetKey = a.deal === "rent" ? "rent" : "buy";
        const ranges: { v: string; range: [number, number]; label: string }[] = a.deal === "rent"
          ? [
              { v: "0-500", range: [0, 500], label: t(`ma.budget.${budgetKey}.0`) },
              { v: "500-1000", range: [500, 1000], label: t(`ma.budget.${budgetKey}.1`) },
              { v: "1000-2000", range: [1000, 2000], label: t(`ma.budget.${budgetKey}.2`) },
              { v: "2000-9999999", range: [2000, 9999999], label: t(`ma.budget.${budgetKey}.3`) },
            ]
          : [
              { v: "0-80000", range: [0, 80000], label: t(`ma.budget.${budgetKey}.0`) },
              { v: "80000-150000", range: [80000, 150000], label: t(`ma.budget.${budgetKey}.1`) },
              { v: "150000-300000", range: [150000, 300000], label: t(`ma.budget.${budgetKey}.2`) },
              { v: "300000-9999999", range: [300000, 9999999], label: t(`ma.budget.${budgetKey}.3`) },
            ];
        return (
          <Question title={t("ma.q.budget")}>
            <Pills
              options={[
                ...ranges.map((r) => ({ v: r.v, label: r.label })),
                { v: "any", label: t("search.notSure") },
              ]}
              value={a.budget === "any" ? "any" : a.budget ? `${a.budget[0]}-${a.budget[1]}` : undefined}
              onChange={(v) => {
                if (v === "any") { autoAdvance(() => setA({ ...a, budget: "any" })); return; }
                const r = ranges.find((x) => x.v === v)!;
                autoAdvance(() => setA({ ...a, budget: r.range }));
              }}
            />
          </Question>
        );
      },
    },
    {
      key: "rooms",
      render: () => (
        <Question title={t("ma.q.rooms")}>
          <Pills
            options={[
              { v: "0", label: t("ma.studio") },
              { v: "1", label: "1" },
              { v: "2", label: "2" },
              { v: "3", label: "3" },
              { v: "4", label: "4+" },
              { v: "any", label: t("search.notSure") },
            ]}
            value={a.rooms === "any" ? "any" : a.rooms !== undefined ? String(a.rooms) : undefined}
            onChange={(v) => autoAdvance(() => setA({ ...a, rooms: v === "any" ? "any" : Number(v) }))}
          />
        </Question>
      ),
    },
    {
      key: "purpose",
      render: () => (
        <Question title={t("ma.q.purpose")}>
          <Pills
            multi
            t={t}
            options={(["living","family","investment","rental","sea","business"] as PurposeKey[]).map((p) => ({ v: p, label: t(`ma.purpose.${p}`) }))}
            value={a.purpose}
            onChange={(v) => setA({ ...a, purpose: v as PurposeKey[] })}
          />
        </Question>
      ),
    },
    {
      key: "features",
      render: () => (
        <Question title={t("ma.q.features")}>
          <Pills
            multi
            t={t}
            options={(["seaview","parking","balcony","renovation","newBuild","furnished","elevator"] as FeatureKey[]).map((f) => ({
              v: f,
              label: f === "newBuild" ? t("badge.newBuild") : t(`feat.${f}`),
            }))}
            value={a.features}
            onChange={(v) => setA({ ...a, features: v as FeatureKey[] })}
          />
        </Question>
      ),
    },
  ];

  if (!open) return null;

  const isResults = step === steps.length;
  const isContact = step === steps.length + 1;
  const totalSteps = steps.length + 2;

  const canNext = (() => {
    if (!isMultiStep) return true; // single-select auto-advances
    switch (step) {
      case 2: return a.district.length > 0;
      case 5: return a.purpose.length > 0;
      case 6: return true;
      default: return true;
    }
  })();

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!contact.name.trim()) errs.name = t("form.err.required");
    if (!contact.phone.trim() || contact.phone.replace(/\D/g, "").length < 7) errs.phone = t("form.err.phone");
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const payload = {
      type: "property_match",
      locale,
      answers: a,
      recommended: matches.exact.concat(matches.close).slice(0, 6).map((p) => ({ id: p.id, title: p.titleKey.en })),
      contact,
      submittedAt: new Date().toISOString(),
    };
    console.log("[FORM]", payload);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-fade-in-fast">
      <div className="relative flex flex-col w-full max-w-5xl bg-background rounded-[28px] shadow-2xl overflow-hidden" style={{ maxHeight: "88vh" }}>
        {/* Header */}
        <div className="flex-none border-b border-border bg-background">
          <div className="flex h-16 items-center justify-between gap-4 px-6 sm:px-8">
            <div className="min-w-0">
              <p className="truncate font-display text-base font-bold text-primary sm:text-lg">{t("ma.title")}</p>
              <p className="text-[11px] text-muted-foreground">{t("ma.step", { a: Math.min(step + 1, totalSteps), b: totalSteps })}</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label={t("cta.close")} className="rounded-full p-2 hover:bg-secondary transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="h-1 w-full bg-secondary/50">
            <div
              className="h-full bg-[hsl(var(--teal))] transition-all duration-500 ease-out"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 sm:px-10 py-8 md:py-10">
          {!isResults && !isContact && (
            <div className="grid gap-8 md:grid-cols-[1fr_280px]">
              <div className="animate-fade-in">{steps[step].render()}</div>
              <SummaryPanel a={a} />
            </div>
          )}

          {isResults && (
            <div className="animate-fade-in">
              <h2 className="font-display text-2xl font-bold text-primary md:text-3xl">{t("ma.results.title")}</h2>
              <p className="mt-2 text-muted-foreground">
                {matches.exact.length > 0
                  ? t("ma.results.exact", { n: matches.exact.length })
                  : matches.close.length > 0
                  ? t("ma.results.close")
                  : t("ma.results.empty")}
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {(matches.exact.length ? matches.exact : matches.close).slice(0, 6).map((p) => (
                  <PropertyCard key={p.id} p={p} why={t("ma.whyText")} />
                ))}
              </div>
              {/* Contextual WhatsApp CTA */}
              <div className="mt-8 rounded-xl border border-[hsl(var(--teal))]/20 bg-[hsl(var(--teal))]/5 p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground">{t("ma.wa.cta")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("ma.q.contact")}</p>
                </div>
                <a
                  href={buildAssistantWA(a, locale, t)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline shrink-0"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>
          )}

          {isContact && !submitted && (
            <div className="mx-auto max-w-xl animate-fade-in">
              <h2 className="font-display text-2xl font-bold text-primary">{t("ma.q.contact")}</h2>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="label-base">{t("form.name")}</label>
                  <input className="input-base" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} maxLength={80} />
                  {errors.name && <p className="mt-1 text-xs text-[hsl(var(--destructive))]">{errors.name}</p>}
                </div>
                <div>
                  <label className="label-base">{t("form.phone")}</label>
                  <input className="input-base" inputMode="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} maxLength={32} />
                  {errors.phone && <p className="mt-1 text-xs text-[hsl(var(--destructive))]">{errors.phone}</p>}
                </div>
                <div>
                  <label className="label-base">{t("form.message")} <span className="lowercase text-muted-foreground/70">{t("form.optional")}</span></label>
                  <textarea className="input-base min-h-24" value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} maxLength={1000} />
                </div>
              </div>
            </div>
          )}

          {submitted && (
            <div className="mx-auto max-w-lg text-center animate-fade-in py-10">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] ring-8 ring-[hsl(var(--success))]/5">
                <Check className="h-10 w-10" />
              </div>
              <h2 className="mt-8 font-display text-3xl font-bold text-primary tracking-tight">{t("form.success")}</h2>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">{t("ma.success")}</p>
              <button onClick={() => setOpen(false)} className="btn-primary mt-8 px-8 py-3.5 shadow-lg shadow-primary/20">{t("cta.close")}</button>
            </div>
          )}
          </div>
        </div>

        {/* Bottom navigation */}
        {!submitted && (
          <div className="flex-none border-t border-border bg-background">
            <div className="flex h-16 items-center justify-between gap-3 px-6 sm:px-8">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="btn-ghost disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> {t("cta.back")}
              </button>
              {/* Show Next only for multi-select steps, results, and contact */}
              {(isMultiStep || isResults || isContact) && (
                !isContact ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canNext}
                    className="btn-primary disabled:opacity-50"
                  >
                    {isResults ? t("cta.send") : step === steps.length - 1 ? t("cta.finish") : t("ma.next")}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button onClick={handleSubmit} className="btn-primary">
                    {t("cta.send")} <ChevronRight className="h-4 w-4" />
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-in-fast">
      <h2 className="font-display text-2xl font-extrabold text-primary md:text-3xl tracking-tight leading-tight">{title}</h2>
      <div className="mt-7">{children}</div>
    </div>
  );
}

function OptionCards({
  options, value, onChange,
}: {
  options: { v: string; label: string; desc?: string }[];
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {options.map((o) => {
        const sel = value === o.v;
        return (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            className={`group relative flex flex-col items-start gap-2 rounded-2xl border-2 p-6 text-left transition-all duration-200 active:scale-[0.98] ${
              sel
                ? "border-[hsl(var(--teal))] bg-[hsl(var(--teal))]/5 shadow-md"
                : "border-border bg-card hover:border-[hsl(var(--teal))]/50 hover:bg-secondary/60 hover:shadow-sm"
            }`}
          >
            {sel && (
              <span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-[hsl(var(--success))] text-white">
                <Check className="h-3.5 w-3.5" />
              </span>
            )}
            <span className={`text-lg font-bold tracking-tight ${
              sel ? "text-[hsl(var(--teal))]" : "text-primary"
            }`}>{o.label}</span>
            {o.desc && <span className="text-sm text-muted-foreground leading-relaxed">{o.desc}</span>}
          </button>
        );
      })}
    </div>
  );
}

function Pills({
  options, value, onChange, multi = false, t
}: {
  options: { v: string; label: string }[];
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
  multi?: boolean;
  t?: (key: string) => string;
}) {
  const isSelected = (v: string) => multi ? (value as string[] || []).includes(v) : value === v;
  const toggle = (v: string) => {
    if (multi) {
      if (v === "any") return onChange(["any"]);
      const current = value as string[] || [];
      const next = current.includes(v) ? current.filter(x => x !== v) : [...current.filter(x => x !== "any"), v];
      onChange(next);
    } else {
      onChange(v);
    }
  };

  return (
    <div className="animate-fade-in-fast">
      {multi && t && <p className="mb-4 text-sm font-medium text-muted-foreground">{t("ma.multiselect.helper")}</p>}
      <div className="flex flex-wrap gap-3">
        {options.map((o) => {
          const sel = isSelected(o.v);
          return (
            <button
              key={o.v}
              onClick={() => toggle(o.v)}
              className={`rounded-full border px-6 py-3.5 text-[15px] font-bold transition-all active:scale-95 shadow-sm ${
                sel
                  ? "border-[hsl(var(--teal))] bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))] shadow-[hsl(var(--teal))]/20"
                  : "border-border bg-card text-foreground/80 hover:border-[hsl(var(--teal))]/40 hover:bg-secondary hover:text-foreground"
              }`}
            >
              {sel && <Check className="mr-2 inline h-4 w-4" />}
              {o.label}
            </button>
          );
        })}
      </div>
      {multi && (value as string[] || []).length > 1 && t && (
        <button onClick={() => onChange([])} className="mt-5 flex items-center text-sm font-semibold text-muted-foreground hover:text-[hsl(var(--destructive))] transition-colors">
          <X className="h-4 w-4 mr-1" />{t("ma.clearSelected")}
        </button>
      )}
    </div>
  );
}

function SummaryPanel({ a }: { a: Answers }) {
  const { t } = useLang();
  const rows: { k: string; v: string }[] = [];
  if (a.deal) rows.push({ k: t("search.deal"), v: t(`deal.${a.deal}`) });
  if (a.type) rows.push({ k: t("search.type"), v: t(`ptype.${a.type}`) });
  if (a.district && a.district.length > 0) rows.push({ k: t("search.district"), v: a.district.includes("any") ? t("search.any") : a.district.map(d => t(`d.${d}`)).join(", ") });
  if (a.budget) rows.push({ k: t("search.price"), v: a.budget === "any" ? t("search.any") : `€${a.budget[0].toLocaleString()}–€${a.budget[1] >= 9999999 ? "∞" : a.budget[1].toLocaleString()}` });
  if (a.rooms !== undefined) rows.push({ k: t("search.rooms"), v: a.rooms === "any" ? t("search.any") : a.rooms === 0 ? t("ma.studio") : String(a.rooms) });
  if (a.purpose && a.purpose.length > 0) rows.push({ k: t("ma.q.purpose"), v: a.purpose.map(p => t(`ma.purpose.${p}`)).join(", ") });
  if (a.features && a.features.length > 0) rows.push({ k: t("ma.q.features"), v: a.features.map(f => f === "newBuild" ? t("badge.newBuild") : t(`feat.${f}`)).join(", ") });
  return (
    <aside className="sticky top-6 hidden h-fit rounded-2xl border border-border bg-secondary/40 p-5 shadow-sm md:block">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("ma.summary")}</p>
      {rows.length === 0 ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-foreground/80">{t("ma.summary.empty")}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{t("ma.summary.emptyHint")}</p>
        </div>
      ) : (
        <dl className="mt-4 space-y-2.5">
          {rows.map((r) => (
            <div key={r.k} className="flex items-start justify-between gap-2 border-b border-border/50 pb-2 last:border-0">
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground shrink-0">{r.k}</dt>
              <dd className="text-right text-xs font-semibold text-foreground">{r.v}</dd>
            </div>
          ))}
        </dl>
      )}
    </aside>
  );
}

// Build contextual WhatsApp message from assistant answers
function buildAssistantWA(a: Answers, locale: string, t: (k: string) => string): string {
  const deal = a.deal ? t(`deal.${a.deal}`) : "";
  const district = a.district && a.district.length > 0 && !a.district.includes("any") ? a.district.map(d => t(`d.${d}`)).join(", ") : "";
  const budget = a.budget && a.budget !== "any"
    ? `€${a.budget[0].toLocaleString()}–€${a.budget[1] >= 9999999 ? "∞" : a.budget[1].toLocaleString()}`
    : "";
  const rooms = a.rooms !== undefined && a.rooms !== "any" ? (a.rooms === 0 ? t("ma.studio") : String(a.rooms)) : "";
  const features = a.features && a.features.length > 0 ? a.features.map(f => f === "newBuild" ? t("badge.newBuild") : t(`feat.${f}`)).join(", ") : "";

  let msg = "";
  if (locale === "uk") {
    msg = `Вітаю! Я шукаю нерухомість${deal ? ` (${deal})` : ""}${district ? ` в районі ${district}` : ""}${rooms ? `, кімнат: ${rooms}` : ""}${budget ? `, бюджет ${budget}` : ""}${features ? `. Важливо: ${features}` : ""}. Можете допомогти з підбором?`;
  } else if (locale === "ro") {
    msg = `Bună ziua! Caut o proprietate${deal ? ` (${deal})` : ""}${district ? ` în zona ${district}` : ""}${rooms ? `, camere: ${rooms}` : ""}${budget ? `, buget ${budget}` : ""}${features ? `. Important: ${features}` : ""}. Puteți ajuta cu selecția?`;
  } else {
    msg = `Hello! I'm looking for a property${deal ? ` (${deal})` : ""}${district ? ` in ${district}` : ""}${rooms ? `, rooms: ${rooms}` : ""}${budget ? `, budget ${budget}` : ""}${features ? `. Important: ${features}` : ""}. Can you help with the search?`;
  }
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

// Matching logic — uses only existing PROPERTIES
function matchProperties(a: Answers): { exact: Property[]; close: Property[] } {
  const scored = PROPERTIES.map((p) => {
    let score = 0;
    let hard = true;
    if (a.deal && p.deal !== a.deal) hard = false;
    if (a.type && p.type !== a.type) hard = false;
    if (a.district && a.district.length > 0 && !a.district.includes("any") && !a.district.includes(p.district)) hard = false;
    if (a.budget && a.budget !== "any" && (p.price < a.budget[0] || p.price > a.budget[1])) hard = false;
    if (a.rooms !== undefined && a.rooms !== "any" && p.rooms < (a.rooms as number)) hard = false;

    // soft scoring
    if (a.deal && p.deal === a.deal) score += 3;
    if (a.type && p.type === a.type) score += 3;
    if (a.district && a.district.length > 0 && !a.district.includes("any") && a.district.includes(p.district)) score += 3;
    if (a.budget && a.budget !== "any" && p.price >= a.budget[0] && p.price <= a.budget[1]) score += 3;
    if (a.rooms !== undefined && a.rooms !== "any" && p.rooms === a.rooms) score += 2;
    if (a.purpose && a.purpose.length > 0 && a.purpose.some(pur => p.purpose.includes(pur))) score += 2;
    a.features.forEach((f) => { if (p.features.includes(f)) score += 1; });

    return { p, score, hard };
  }).sort((x, y) => y.score - x.score);

  return {
    exact: scored.filter((s) => s.hard).map((s) => s.p),
    close: scored.filter((s) => !s.hard && s.score >= 4).map((s) => s.p),
  };
}
