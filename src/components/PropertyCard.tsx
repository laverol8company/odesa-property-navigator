import { Property, formatPrice } from "@/data/properties";
import { useLang } from "@/lib/LanguageContext";
import { Link } from "react-router-dom";
import { MapPin, Bed, Maximize, Building2, MessageCircle, Heart } from "lucide-react";
import { useState } from "react";

const statusColor: Record<string, string> = {
  available: "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] border-none shadow-md",
  reserved: "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] border-none shadow-md",
  sold: "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] border-none shadow-md",
};

export default function PropertyCard({ p, why }: { p: Property; why?: string }) {
  const { t, locale } = useLang();
  const [fav, setFav] = useState(false);

  const wa = `https://wa.me/?text=${encodeURIComponent(
    locale === "uk"
      ? `Вітаю, мене цікавить об’єкт: ${p.titleKey.uk}, район ${t(`d.${p.district}`)}, ціна ${formatPrice(p, locale)}. Чи доступний перегляд?`
      : locale === "ro"
      ? `Bună ziua, sunt interesat de ${p.titleKey.ro} în ${t(`d.${p.district}`)}, listat la ${formatPrice(p, locale)}. Este disponibilă o vizionare?`
      : `Hi, I’m interested in ${p.titleKey.en} in ${t(`d.${p.district}`)}, listed for ${formatPrice(p, locale)}. Is a viewing available?`
  )}`;

  return (
    <article className="group card-surface overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/properties/${p.id}`} className="relative block aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={p.images[0]}
          alt={p.titleKey[locale]}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className={`rounded-full px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider ${statusColor[p.status]}`}>
            {t(`status.${p.status}`)}
          </span>
          {p.badges.includes("premium") && (
            <span className="rounded-full bg-[hsl(var(--gold))] px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[hsl(var(--gold-foreground))] shadow-md">
              {t("badge.premium")}
            </span>
          )}
          {p.badges.includes("seaview") && (
            <span className="rounded-full bg-[hsl(var(--teal))] px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
              {t("badge.seaview")}
            </span>
          )}
          {p.badges.includes("new") && (
            <span className="rounded-full bg-primary px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-primary-foreground shadow-md">
              {t("badge.new")}
            </span>
          )}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); setFav((f) => !f); }}
          aria-label="Save"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-foreground shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <Heart className={`h-4 w-4 transition-colors ${fav ? "fill-[hsl(var(--destructive))] text-[hsl(var(--destructive))]" : "text-foreground/50"}`} />
        </button>
      </Link>

      <div className="flex flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="font-display text-2xl font-extrabold text-primary tracking-tight">{formatPrice(p, locale)}</p>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
            {t(`deal.${p.deal}`)}
          </span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-foreground/90 group-hover:text-primary transition-colors">{p.titleKey[locale]}</h3>

        <div className="mt-2.5 flex items-center gap-1.5 text-sm text-[hsl(var(--teal))]">
          <MapPin className="h-4 w-4" />
          <span className="font-medium">{t(`d.${p.district}`)}, Odesa</span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4 text-[13px] text-muted-foreground font-medium">
          <span className="flex flex-col items-center gap-1" title={t("search.rooms")}>
            <Bed className="h-4 w-4 text-foreground/40" /> 
            <span>{p.rooms === 0 ? t("ma.studio") : p.rooms}</span>
          </span>
          <span className="flex flex-col items-center gap-1" title={t("search.area")}>
            <Maximize className="h-4 w-4 text-foreground/40" /> 
            <span>{p.area} m²</span>
          </span>
          {p.floor !== undefined ? (
            <span className="flex flex-col items-center gap-1" title={t("search.floor")}>
              <Building2 className="h-4 w-4 text-foreground/40" /> 
              <span>{p.floor}/{p.totalFloors ?? "-"}</span>
            </span>
          ) : (
            <span className="flex flex-col items-center gap-1 text-transparent">
              <Building2 className="h-4 w-4" /> - 
            </span>
          )}
        </div>

        {why && (
          <div className="mt-4 rounded-lg border border-[hsl(var(--gold))]/20 bg-[hsl(var(--gold))]/5 px-3.5 py-2.5 text-xs text-foreground/80 leading-relaxed shadow-sm">
            <span className="font-bold text-[hsl(var(--gold-foreground))]">{t("ma.why")}:</span> {why}
          </div>
        )}

        <div className="mt-5 flex items-stretch gap-2">
          <Link
            to={`/properties/${p.id}`}
            className="btn-primary flex-1 py-2.5 text-sm shadow-md shadow-primary/10 whitespace-nowrap"
          >
            {t("cta.viewProperty")}
          </Link>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-border bg-card text-[hsl(var(--teal))] shadow-sm transition-all hover:bg-[hsl(var(--teal))]/5 hover:border-[hsl(var(--teal))]/30 active:scale-95"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
      </div>
    </article>
  );
}
