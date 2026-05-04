import { useParams, Link, Navigate } from "react-router-dom";
import { PROPERTIES, formatPrice } from "@/data/properties";
import { useLang } from "@/lib/LanguageContext";
import { useState } from "react";
import { MapPin, Bed, Maximize, Building2, MessageCircle, Calendar, ArrowLeft, Check } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";

export default function PropertyDetail() {
  const { id } = useParams();
  const { t, locale } = useLang();
  const p = PROPERTIES.find((x) => x.id === id);
  const [active, setActive] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  if (!p) return <Navigate to="/properties" replace />;

  const wa = `https://wa.me/?text=${encodeURIComponent(
    locale === "uk"
      ? `Вітаю, мене цікавить об’єкт: ${p.titleKey.uk}, район ${t(`d.${p.district}`)}, ціна ${formatPrice(p, locale)}. Чи доступний перегляд?`
      : locale === "ro"
      ? `Bună ziua, sunt interesat de ${p.titleKey.ro} în ${t(`d.${p.district}`)}, listat la ${formatPrice(p, locale)}. Este disponibilă o vizionare?`
      : `Hi, I’m interested in ${p.titleKey.en} in ${t(`d.${p.district}`)}, listed for ${formatPrice(p, locale)}. Is a viewing available?`
  )}`;

  const similar = PROPERTIES.filter((x) => x.id !== p.id && (x.district === p.district || x.type === p.type)).slice(0, 3);

  const submit = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t("form.err.required");
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 7) e.phone = t("form.err.phone");
    setErrors(e);
    if (Object.keys(e).length) return;
    console.log("[FORM]", { type: "viewing_request", propertyId: p.id, locale, ...form, submittedAt: new Date().toISOString() });
    setSuccess(true);
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto container-px py-6">
        <Link to="/properties" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {t("nav.properties")}
        </Link>
      </div>

      <section className="container mx-auto container-px">
        <div className="grid gap-3 md:grid-cols-[1.6fr_1fr]">
          <div className="aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
            <img src={p.images[active]} alt={p.titleKey[locale]} className="h-full w-full object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-2">
            {p.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`aspect-[4/3] overflow-hidden rounded-md border-2 transition ${active === i ? "border-[hsl(var(--gold))]" : "border-transparent"}`}
              >
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto container-px py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/15 px-2.5 py-1 text-[10px] font-semibold uppercase text-[hsl(var(--success))]">
                {t(`status.${p.status}`)}
              </span>
              {p.badges.map((b) => (
                <span key={b} className="rounded-full bg-[hsl(var(--gold))]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--gold-foreground))]">
                  {t(`badge.${b}`)}
                </span>
              ))}
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold text-primary md:text-4xl">{p.titleKey[locale]}</h1>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[hsl(var(--teal))]">
              <MapPin className="h-4 w-4" /> {t(`d.${p.district}`)}, Odesa
            </p>
            <p className="mt-5 font-display text-3xl font-bold text-primary">{formatPrice(p, locale)}</p>

            <div className="mt-8">
              <h2 className="font-display text-xl font-bold text-primary">{t("det.overview")}</h2>
              <p className="mt-3 text-muted-foreground">{p.description[locale]}</p>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-xl font-bold text-primary">{t("det.key")}</h2>
              <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <KV k={t("det.dealLabel")} v={t(`deal.${p.deal}`)} />
                <KV k={t("det.typeLabel")} v={t(`ptype.${p.type}`)} />
                <KV k={t("det.roomsLabel")} v={p.rooms === 0 ? "Studio" : String(p.rooms)} />
                <KV k={t("det.areaLabel")} v={`${p.area} m²`} />
                {p.floor !== undefined && <KV k={t("det.floorLabel")} v={`${p.floor}/${p.totalFloors ?? "-"}`} />}
                <KV k={t("det.priceLabel")} v={formatPrice(p, locale)} />
              </dl>
            </div>

            {p.features.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-xl font-bold text-primary">{t("det.features")}</h2>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-[hsl(var(--success))]" />
                      {f === "newBuild" ? t("badge.newBuild") : f === "resale" ? t("badge.resale") : t(`feat.${f}`)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8">
              <h2 className="font-display text-xl font-bold text-primary">{t("det.area")}</h2>
              <div className="mt-4 grid place-items-center rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-12 text-center">
                <MapPin className="h-8 w-8 text-[hsl(var(--teal))]" />
                <p className="mt-3 font-semibold text-primary">{t(`d.${p.district}`)}, Odesa</p>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">{t("det.location")}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="card-surface p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("det.priceLabel")}</p>
              <p className="mt-1 font-display text-2xl font-bold text-primary">{formatPrice(p, locale)}</p>
              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-xs">
                <span className="inline-flex flex-col items-center gap-1"><Bed className="h-4 w-4 text-[hsl(var(--teal))]" /> {p.rooms === 0 ? "Studio" : p.rooms}</span>
                <span className="inline-flex flex-col items-center gap-1"><Maximize className="h-4 w-4 text-[hsl(var(--teal))]" /> {p.area} m²</span>
                {p.floor !== undefined && <span className="inline-flex flex-col items-center gap-1"><Building2 className="h-4 w-4 text-[hsl(var(--teal))]" /> {p.floor}/{p.totalFloors ?? "-"}</span>}
              </div>
            </div>

            {success ? (
              <div className="card-surface p-6 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]"><Check className="h-6 w-6" /></div>
                <p className="mt-4 font-semibold text-primary">{t("form.success")}</p>
              </div>
            ) : (
              <div className="card-surface p-6">
                <p className="font-display text-lg font-bold text-primary">{t("cta.requestViewing")}</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="label-base">{t("form.name")}</label>
                    <input className="input-base" maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    {errors.name && <p className="mt-1 text-xs text-[hsl(var(--destructive))]">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="label-base">{t("form.phone")}</label>
                    <input className="input-base" inputMode="tel" maxLength={32} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    {errors.phone && <p className="mt-1 text-xs text-[hsl(var(--destructive))]">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="label-base">{t("form.message")} <span className="lowercase text-muted-foreground/70">{t("form.optional")}</span></label>
                    <textarea className="input-base min-h-20" maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <button onClick={submit} className="btn-primary w-full"><Calendar className="h-4 w-4" /> {t("cta.requestViewing")}</button>
                  <a href={wa} target="_blank" rel="noreferrer" className="btn-outline w-full"><MessageCircle className="h-4 w-4" /> {t("cta.whatsapp")}</a>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="container mx-auto container-px py-12">
          <h2 className="font-display text-2xl font-bold text-primary">{t("det.similar")}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => <PropertyCard key={s.id} p={s} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border bg-card px-4 py-3">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{k}</dt>
      <dd className="mt-1 text-sm font-semibold text-foreground">{v}</dd>
    </div>
  );
}
