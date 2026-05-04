import { useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight, Check, Search } from "lucide-react";
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
  district?: DistrictKey | "any";
  budget?: [number, number] | "any";
  rooms?: number | "any";
  purpose?: PurposeKey;
  features: FeatureKey[];
};

const initial: Answers = { features: [] };

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

  const steps: { key: string; render: () => JSX.Element }[] = [
    {
      key: "deal",
      render: () => (
        <Question title={t("ma.q.deal")}>
          <Pills
            options={[
              { v: "buy", label: t("deal.buy") },
              { v: "rent", label: t("deal.rent") },
            ]}
            value={a.deal}
            onChange={(v) => setA({ ...a, deal: v as DealType })}
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
            onChange={(v) => setA({ ...a, type: v as PropertyType })}
          />
        </Question>
      ),
    },
    {
      key: "district",
      render: () => (
        <Question title={t("ma.q.district")}>
          <Pills
            options={[
              ...ALL_DISTRICTS.map((d) => ({ v: d, label: t(`d.${d}`) })),
              { v: "any", label: t("search.notSure") },
            ]}
            value={a.district}
            onChange={(v) => setA({ ...a, district: v as DistrictKey | "any" })}
          />
        </Question>
      ),
    },
    {
      key: "budget",
      render: () => {
        const ranges: { v: string; range: [number, number]; label: string }[] = a.deal === "rent"
          ? [
              { v: "0-500", range: [0, 500], label: "до €500/mo" },
              { v: "500-1000", range: [500, 1000], label: "€500–€1,000/mo" },
              { v: "1000-2000", range: [1000, 2000], label: "€1,000–€2,000/mo" },
              { v: "2000-9999999", range: [2000, 9999999], label: "€2,000+/mo" },
            ]
          : [
              { v: "0-80000", range: [0, 80000], label: "до €80,000" },
              { v: "80000-150000", range: [80000, 150000], label: "€80,000–€150,000" },
              { v: "150000-300000", range: [150000, 300000], label: "€150,000–€300,000" },
              { v: "300000-9999999", range: [300000, 9999999], label: "€300,000+" },
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
                if (v === "any") return setA({ ...a, budget: "any" });
                const r = ranges.find((x) => x.v === v)!;
                setA({ ...a, budget: r.range });
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
              { v: "0", label: "Studio" },
              { v: "1", label: "1" },
              { v: "2", label: "2" },
              { v: "3", label: "3" },
              { v: "4", label: "4+" },
              { v: "any", label: t("search.notSure") },
            ]}
            value={a.rooms === "any" ? "any" : a.rooms !== undefined ? String(a.rooms) : undefined}
            onChange={(v) => setA({ ...a, rooms: v === "any" ? "any" : Number(v) })}
          />
        </Question>
      ),
    },
    {
      key: "purpose",
      render: () => (
        <Question title={t("ma.q.purpose")}>
          <Pills
            options={(["living","family","investment","rental","sea","business"] as PurposeKey[]).map((p) => ({ v: p, label: t(`ma.purpose.${p}`) }))}
            value={a.purpose}
            onChange={(v) => setA({ ...a, purpose: v as PurposeKey })}
          />
        </Question>
      ),
    },
    {
      key: "features",
      render: () => (
        <Question title={t("ma.q.features")}>
          <div className="flex flex-wrap gap-2">
            {(["seaview","parking","balcony","renovation","newBuild","furnished","elevator"] as FeatureKey[]).map((f) => {
              const sel = a.features.includes(f);
              return (
                <button
                  key={f}
                  onClick={() =>
                    setA({
                      ...a,
                      features: sel ? a.features.filter((x) => x !== f) : [...a.features, f],
                    })
                  }
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    sel
                      ? "border-[hsl(var(--teal))] bg-[hsl(var(--teal))] text-white"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  {sel && <Check className="mr-1 inline h-3.5 w-3.5" />}
                  {t(`feat.${f === "newBuild" ? "renovation" : f}`) /* fallback safety */}
                  {/* real label below overrides */}
                </button>
              );
            })}
          </div>
        </Question>
      ),
    },
  ];

  if (!open) return null;

  const isResults = step === steps.length;
  const isContact = step === steps.length + 1;
  const totalSteps = steps.length + 2;

  const canNext = (() => {
    switch (step) {
      case 0: return !!a.deal;
      case 1: return !!a.type;
      case 2: return !!a.district;
      case 3: return !!a.budget;
      case 4: return a.rooms !== undefined;
      case 5: return !!a.purpose;
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
    <div className="fixed inset-0 z-[100] flex flex-col bg-background animate-fade-in-fast">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto container-px flex h-16 items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold text-primary sm:text-lg">{t("ma.title")}</p>
            <p className="text-[11px] text-muted-foreground">{t("ma.step", { a: Math.min(step + 1, totalSteps), b: totalSteps })}</p>
          </div>
          <button onClick={() => setOpen(false)} aria-label={t("cta.close")} className="rounded-md p-2 hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-1 w-full bg-secondary">
          <div
            className="h-full bg-[hsl(var(--gold))] transition-all"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto container-px py-8 md:py-14">
          {!isResults && !isContact && (
            <div className="grid gap-10 md:grid-cols-[1fr_320px]">
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
            <div className="mx-auto max-w-lg text-center animate-fade-in">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]">
                <Check className="h-7 w-7" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold text-primary">{t("form.success")}</h2>
              <p className="mt-3 text-muted-foreground">{t("ma.success")}</p>
              <button onClick={() => setOpen(false)} className="btn-primary mt-6">{t("cta.close")}</button>
            </div>
          )}
        </div>
      </div>

      {!submitted && (
        <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur">
          <div className="container mx-auto container-px flex h-16 items-center justify-between gap-3">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="btn-ghost disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> {t("cta.back")}
            </button>
            {!isContact ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext}
                className="btn-primary disabled:opacity-50"
              >
                {isResults ? t("cta.send") : step === steps.length - 1 ? t("cta.finish") : t("cta.next")}
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-primary">
                {t("cta.send")} <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-primary md:text-4xl">{title}</h2>
      <div className="mt-7">{children}</div>
    </div>
  );
}

function Pills({
  options, value, onChange,
}: {
  options: { v: string; label: string }[];
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => {
        const sel = value === o.v;
        return (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            className={`rounded-full border px-5 py-3 text-sm font-medium transition ${
              sel
                ? "border-[hsl(var(--teal))] bg-[hsl(var(--teal))] text-white shadow-sm"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            {sel && <Check className="mr-1 inline h-3.5 w-3.5" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function SummaryPanel({ a }: { a: Answers }) {
  const { t } = useLang();
  const rows: { k: string; v: string }[] = [];
  if (a.deal) rows.push({ k: t("search.deal"), v: t(`deal.${a.deal}`) });
  if (a.type) rows.push({ k: t("search.type"), v: t(`ptype.${a.type}`) });
  if (a.district) rows.push({ k: t("search.district"), v: a.district === "any" ? t("search.any") : t(`d.${a.district}`) });
  if (a.budget) rows.push({ k: t("search.price"), v: a.budget === "any" ? t("search.any") : `€${a.budget[0].toLocaleString()}–€${a.budget[1] >= 9999999 ? "∞" : a.budget[1].toLocaleString()}` });
  if (a.rooms !== undefined) rows.push({ k: t("search.rooms"), v: a.rooms === "any" ? t("search.any") : a.rooms === 0 ? "Studio" : String(a.rooms) });
  if (a.purpose) rows.push({ k: t("ma.q.purpose"), v: t(`ma.purpose.${a.purpose}`) });
  return (
    <aside className="sticky top-24 hidden h-fit rounded-xl border border-border bg-card p-6 shadow-sm md:block">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("ma.summary")}</p>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">—</p>
      ) : (
        <dl className="mt-4 space-y-3">
          {rows.map((r) => (
            <div key={r.k} className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 last:border-0">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{r.k}</dt>
              <dd className="text-right text-sm font-semibold text-foreground">{r.v}</dd>
            </div>
          ))}
        </dl>
      )}
    </aside>
  );
}

// Matching logic — uses only existing PROPERTIES
function matchProperties(a: Answers): { exact: Property[]; close: Property[] } {
  const scored = PROPERTIES.map((p) => {
    let score = 0;
    let hard = true;
    if (a.deal && p.deal !== a.deal) hard = false;
    if (a.type && p.type !== a.type) hard = false;
    if (a.district && a.district !== "any" && p.district !== a.district) hard = false;
    if (a.budget && a.budget !== "any" && (p.price < a.budget[0] || p.price > a.budget[1])) hard = false;
    if (a.rooms !== undefined && a.rooms !== "any" && p.rooms < (a.rooms as number)) hard = false;

    // soft scoring
    if (a.deal && p.deal === a.deal) score += 3;
    if (a.type && p.type === a.type) score += 3;
    if (a.district && a.district !== "any" && p.district === a.district) score += 3;
    if (a.budget && a.budget !== "any" && p.price >= a.budget[0] && p.price <= a.budget[1]) score += 3;
    if (a.rooms !== undefined && a.rooms !== "any" && p.rooms === a.rooms) score += 2;
    if (a.purpose && p.purpose.includes(a.purpose)) score += 2;
    a.features.forEach((f) => { if (p.features.includes(f)) score += 1; });

    return { p, score, hard };
  }).sort((x, y) => y.score - x.score);

  return {
    exact: scored.filter((s) => s.hard).map((s) => s.p),
    close: scored.filter((s) => !s.hard && s.score >= 4).map((s) => s.p),
  };
}
