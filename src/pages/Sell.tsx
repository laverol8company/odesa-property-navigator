import { useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { ALL_DISTRICTS, ALL_TYPES, DistrictKey, PropertyType } from "@/data/properties";
import { Check, MessageCircle, Scale } from "lucide-react";

type Form = {
  intent?: "sell" | "rentout";
  type?: PropertyType;
  district?: DistrictKey;
  area?: string;
  rooms?: string;
  condition?: "new" | "good" | "needs";
  expectedPrice?: string;
  timing?: "now" | "soon" | "later";
  name: string; phone: string; message: string;
};

export default function Sell() {
  const { t, locale } = useLang();
  const [f, setF] = useState<Form>({ name: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!f.intent) errs.intent = t("form.err.required");
    if (!f.name.trim()) errs.name = t("form.err.required");
    if (!f.phone.trim() || f.phone.replace(/\D/g, "").length < 7) errs.phone = t("form.err.phone");
    setErrors(errs);
    if (Object.keys(errs).length) return;
    console.log("[FORM]", { type: "sell_rentout", locale, ...f, submittedAt: new Date().toISOString() });
    setSuccess(true);
  };

  const wa = `https://wa.me/?text=${encodeURIComponent(
    locale === "uk"
      ? "Вітаю, хочу отримати консультацію щодо продажу або здачі нерухомості в Одесі."
      : locale === "ro"
      ? "Bună ziua, aș dori să discut despre vânzarea sau închirierea unei proprietăți în Odesa."
      : "Hi, I’d like to discuss selling or renting out a property in Odesa."
  )}`;

  if (success) {
    return (
      <div className="container mx-auto container-px section-y">
        <div className="mx-auto max-w-lg card-surface p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]"><Check className="h-7 w-7" /></div>
          <h1 className="mt-5 font-display text-2xl font-bold text-primary">{t("form.success")}</h1>
          <p className="mt-3 text-muted-foreground">{t("sell.success")}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="border-b border-border bg-secondary/40">
        <div className="container mx-auto container-px py-12">
          <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">{t("sell.title")}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{t("sell.sub")}</p>
        </div>
      </section>

      <section className="container mx-auto container-px section-y">
        <form onSubmit={submit} className="mx-auto max-w-3xl card-surface space-y-6 p-6 md:p-10">
          <div>
            <label className="label-base">{t("sell.intent")}</label>
            <div className="grid grid-cols-2 gap-2">
              {([["sell", t("sell.intent.sell")], ["rentout", t("sell.intent.rent")]] as const).map(([v, label]) => (
                <button type="button" key={v}
                  onClick={() => setF({ ...f, intent: v })}
                  className={`rounded-md border px-4 py-3 text-sm font-medium transition ${f.intent === v ? "border-[hsl(var(--teal))] bg-[hsl(var(--teal))] text-white" : "border-border bg-card hover:border-primary/40"}`}>
                  {label}
                </button>
              ))}
            </div>
            {errors.intent && <p className="mt-1 text-xs text-[hsl(var(--destructive))]">{errors.intent}</p>}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="label-base">{t("search.type")}</label>
              <select className="input-base" value={f.type ?? ""} onChange={(e) => setF({ ...f, type: e.target.value as PropertyType })}>
                <option value="">{t("search.any")}</option>
                {ALL_TYPES.map((tp) => <option key={tp} value={tp}>{t(`ptype.${tp}`)}</option>)}
              </select>
            </div>
            <div>
              <label className="label-base">{t("search.district")}</label>
              <select className="input-base" value={f.district ?? ""} onChange={(e) => setF({ ...f, district: e.target.value as DistrictKey })}>
                <option value="">{t("search.any")}</option>
                {ALL_DISTRICTS.map((d) => <option key={d} value={d}>{t(`d.${d}`)}</option>)}
              </select>
            </div>
            <div>
              <label className="label-base">{t("search.area")} (m²)</label>
              <input className="input-base" type="number" inputMode="numeric" value={f.area ?? ""} onChange={(e) => setF({ ...f, area: e.target.value })} />
            </div>
            <div>
              <label className="label-base">{t("search.rooms")}</label>
              <input className="input-base" type="number" inputMode="numeric" value={f.rooms ?? ""} onChange={(e) => setF({ ...f, rooms: e.target.value })} />
            </div>
            <div>
              <label className="label-base">{t("sell.condition")}</label>
              <select className="input-base" value={f.condition ?? ""} onChange={(e) => setF({ ...f, condition: e.target.value as Form["condition"] })}>
                <option value="">—</option>
                <option value="new">{t("sell.cond.new")}</option>
                <option value="good">{t("sell.cond.good")}</option>
                <option value="needs">{t("sell.cond.needs")}</option>
              </select>
            </div>
            <div>
              <label className="label-base">{t("sell.expectedPrice")} (€) <span className="lowercase text-muted-foreground/70">{t("form.optional")}</span></label>
              <input className="input-base" type="number" inputMode="numeric" value={f.expectedPrice ?? ""} onChange={(e) => setF({ ...f, expectedPrice: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="label-base">{t("sell.timing")}</label>
              <div className="grid grid-cols-3 gap-2">
                {([["now", t("sell.timing.now")], ["soon", t("sell.timing.soon")], ["later", t("sell.timing.later")]] as const).map(([v, label]) => (
                  <button type="button" key={v} onClick={() => setF({ ...f, timing: v })}
                    className={`rounded-md border px-3 py-2.5 text-sm font-medium transition ${f.timing === v ? "border-[hsl(var(--teal))] bg-[hsl(var(--teal))] text-white" : "border-border bg-card hover:border-primary/40"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 border-t border-border pt-6 md:grid-cols-2">
            <div>
              <label className="label-base">{t("form.name")}</label>
              <input className="input-base" maxLength={80} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
              {errors.name && <p className="mt-1 text-xs text-[hsl(var(--destructive))]">{errors.name}</p>}
            </div>
            <div>
              <label className="label-base">{t("form.phone")}</label>
              <input className="input-base" inputMode="tel" maxLength={32} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
              {errors.phone && <p className="mt-1 text-xs text-[hsl(var(--destructive))]">{errors.phone}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="label-base">{t("form.message")} <span className="lowercase text-muted-foreground/70">{t("form.optional")}</span></label>
              <textarea className="input-base min-h-24" maxLength={1000} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn-primary"><Scale className="h-4 w-4" /> {t("cta.requestValuation")}</button>
            <a href={wa} target="_blank" rel="noreferrer" className="btn-outline"><MessageCircle className="h-4 w-4" /> {t("cta.whatsapp")}</a>
          </div>
        </form>
      </section>
    </div>
  );
}
