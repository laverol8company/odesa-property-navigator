import { Property, formatPrice } from "@/data/properties";
import { useLang } from "@/lib/LanguageContext";
import { Link } from "react-router-dom";
import { MapPin, Bed, Maximize, Building2, MessageCircle, Heart } from "lucide-react";
import { useState } from "react";

const statusColor: Record<string, string> = {
  available: "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] border-[hsl(var(--success))]/20",
  reserved: "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30",
  sold: "bg-muted text-muted-foreground border-border",
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
    <article className="group card-surface overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/properties/${p.id}`} className="relative block aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={p.images[0]}
          alt={p.titleKey[locale]}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusColor[p.status]}`}>
            {t(`status.${p.status}`)}
          </span>
          {p.badges.includes("premium") && (
            <span className="rounded-full bg-[hsl(var(--gold))] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--gold-foreground))]">
              {t("badge.premium")}
            </span>
          )}
          {p.badges.includes("seaview") && (
            <span className="rounded-full bg-[hsl(var(--teal))] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {t("badge.seaview")}
            </span>
          )}
          {p.badges.includes("new") && (
            <span className="rounded-full bg-[hsl(var(--warning))] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--warning-foreground))]">
              {t("badge.new")}
            </span>
          )}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); setFav((f) => !f); }}
          aria-label="Save"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur transition hover:bg-white"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-[hsl(var(--destructive))] text-[hsl(var(--destructive))]" : ""}`} />
        </button>
      </Link>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display text-xl font-bold text-primary">{formatPrice(p, locale)}</p>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t(`deal.${p.deal}`)} · {t(`ptype.${p.type}`)}
          </span>
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-semibold text-foreground">{p.titleKey[locale]}</h3>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-[hsl(var(--teal))]">
          <MapPin className="h-3.5 w-3.5" />
          <span className="font-medium">{t(`d.${p.district}`)}, Odesa</span>
        </div>

        <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Bed className="h-3.5 w-3.5" /> {p.rooms === 0 ? "Studio" : p.rooms}</span>
          <span className="inline-flex items-center gap-1.5"><Maximize className="h-3.5 w-3.5" /> {p.area} m²</span>
          {p.floor !== undefined && (
            <span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {p.floor}/{p.totalFloors ?? "-"}</span>
          )}
        </div>

        {why && (
          <div className="mt-3 rounded-md border border-[hsl(var(--gold))]/30 bg-[hsl(var(--gold))]/10 px-3 py-2 text-xs text-foreground/80">
            <span className="font-semibold text-[hsl(var(--gold-foreground))]">{t("ma.why")}:</span> {why}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <Link to={`/properties/${p.id}`} className="btn-primary flex-1 !py-2.5 !text-xs">
            {t("cta.viewProperty")}
          </Link>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="grid h-10 w-10 place-items-center rounded-md border border-border bg-card text-[hsl(var(--teal))] transition hover:bg-secondary"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
