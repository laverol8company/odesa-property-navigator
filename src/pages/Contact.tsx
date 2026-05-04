import { useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { Phone, Mail, MapPin, Clock, MessageCircle, Check } from "lucide-react";

export default function Contact() {
  const { t, locale } = useLang();
  const [f, setF] = useState({ name: "", phone: "", email: "", req: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!f.name.trim()) errs.name = t("form.err.required");
    if (!f.phone.trim() || f.phone.replace(/\D/g, "").length < 7) errs.phone = t("form.err.phone");
    if (!f.req) errs.req = t("form.err.required");
    setErrors(errs);
    if (Object.keys(errs).length) return;
    console.log("[FORM]", { type: "contact", locale, ...f, submittedAt: new Date().toISOString() });
    setSuccess(true);
  };

  return (
    <div>
      <section className="border-b border-border bg-secondary/40">
        <div className="container mx-auto container-px py-12">
          <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">{t("contact.title")}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{t("contact.sub")}</p>
        </div>
      </section>

      <section className="container mx-auto container-px section-y">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-3">
            {[
              { icon: Phone, k: t("contact.phone"), v: "+380 00 000 0000" },
              { icon: Mail, k: t("contact.email"), v: "info@generalrealestate.od" },
              { icon: MessageCircle, k: "WhatsApp", v: "+380 00 000 0000" },
              { icon: Clock, k: t("contact.hours"), v: t("contact.hoursVal") },
              { icon: MapPin, k: t("contact.office"), v: t("contact.officeVal") },
            ].map(({ icon: Icon, k, v }) => (
              <div key={k} className="card-surface flex items-start gap-3 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))]"><Icon className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{k}</p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">{v}</p>
                </div>
              </div>
            ))}
          </div>

          {success ? (
            <div className="card-surface flex flex-col items-center justify-center p-10 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]"><Check className="h-7 w-7" /></div>
              <p className="mt-5 font-display text-xl font-bold text-primary">{t("form.success")}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="card-surface space-y-5 p-6 md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
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
                  <label className="label-base">{t("form.email")} <span className="lowercase text-muted-foreground/70">{t("form.optional")}</span></label>
                  <input className="input-base" type="email" maxLength={120} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="label-base">{t("form.requestType")}</label>
                  <select className="input-base" value={f.req} onChange={(e) => setF({ ...f, req: e.target.value })}>
                    <option value="">—</option>
                    {["buy","rent","sell","rentout","viewing","other"].map((r) => (
                      <option key={r} value={r}>{t(`form.req.${r}`)}</option>
                    ))}
                  </select>
                  {errors.req && <p className="mt-1 text-xs text-[hsl(var(--destructive))]">{errors.req}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="label-base">{t("form.message")}</label>
                  <textarea className="input-base min-h-28" maxLength={1000} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
                </div>
              </div>
              <button className="btn-primary" type="submit">{t("cta.send")}</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
