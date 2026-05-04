import { Link } from "react-router-dom";
import { ArrowRight, Search, Sparkles, Home as HomeIcon, MapPin, ShieldCheck, MessageSquare, Compass, Scale } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { useLang } from "@/lib/LanguageContext";
import { openAssistant } from "@/lib/assistantStore";
import { PROPERTIES, FEATURED_IDS, ALL_DISTRICTS } from "@/data/properties";
import PropertyCard from "@/components/PropertyCard";

export default function Home() {
  const { t } = useLang();
  const featured = FEATURED_IDS.map((id) => PROPERTIES.find((p) => p.id === id)!).filter(Boolean);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" width={1600} height={1024} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        </div>
        <div className="container mx-auto container-px relative grid min-h-[78vh] items-center py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--gold))]/40 bg-[hsl(var(--gold))]/10 px-3 py-1 text-xs font-semibold text-[hsl(var(--gold-foreground))]">
              <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--gold))]" /> Odesa, Ukraine
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-primary md:text-6xl">
              {t("hero.h1")}
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">{t("hero.sub")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/properties" className="btn-primary"><Search className="h-4 w-4" /> {t("cta.browse")}</Link>
              <button onClick={openAssistant} className="btn-gold"><Compass className="h-4 w-4" /> {t("cta.findProperty")}</button>
              <Link to="/sell" className="btn-outline"><Scale className="h-4 w-4" /> {t("cta.requestValuation")}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK SEARCH */}
      <section className="container mx-auto container-px -mt-10 relative z-10">
        <div className="card-surface grid gap-3 p-5 md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:p-6">
          <QuickField label={t("search.deal")}>
            <select className="w-full bg-transparent py-2 text-sm focus:outline-none" id="qs-deal" defaultValue="">
              <option value="">{t("search.any")}</option>
              <option value="buy">{t("deal.buy")}</option>
              <option value="rent">{t("deal.rent")}</option>
            </select>
          </QuickField>
          <QuickField label={t("search.type")}>
            <select className="w-full bg-transparent py-2 text-sm focus:outline-none" id="qs-type" defaultValue="">
              <option value="">{t("search.any")}</option>
              {["apartment","house","townhouse","penthouse","commercial","land"].map((tp) => (
                <option key={tp} value={tp}>{t(`ptype.${tp}`)}</option>
              ))}
            </select>
          </QuickField>
          <QuickField label={t("search.district")}>
            <select className="w-full bg-transparent py-2 text-sm focus:outline-none" id="qs-district" defaultValue="">
              <option value="">{t("search.any")}</option>
              {ALL_DISTRICTS.map((d) => <option key={d} value={d}>{t(`d.${d}`)}</option>)}
            </select>
          </QuickField>
          <QuickField label={t("search.rooms")}>
            <select className="w-full bg-transparent py-2 text-sm focus:outline-none" id="qs-rooms" defaultValue="">
              <option value="">{t("search.any")}</option>
              {[0,1,2,3,4].map((n) => <option key={n} value={n}>{n === 0 ? "Studio" : n === 4 ? "4+" : n}</option>)}
            </select>
          </QuickField>
          <Link to="/properties" className="btn-primary md:self-stretch md:!py-3.5">
            <Search className="h-4 w-4" /> {t("cta.search")}
          </Link>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section-y">
        <div className="container mx-auto container-px">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">{t("sec.featured")}</h2>
              <p className="mt-2 text-muted-foreground">{t("sec.featuredSub")}</p>
            </div>
            <Link to="/properties" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-[hsl(var(--teal))]">
              {t("cta.openCatalog")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* PATH */}
      <section className="bg-secondary/40 section-y">
        <div className="container mx-auto container-px">
          <h2 className="text-center font-display text-3xl font-bold text-primary md:text-4xl">{t("sec.path")}</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: Search, k: "find", to: "/properties", cta: t("cta.openCatalog") },
              { icon: Compass, k: "match", action: openAssistant, cta: t("cta.startMatch") },
              { icon: Scale, k: "sell", to: "/sell", cta: t("cta.requestValuation") },
            ].map(({ icon: Icon, k, to, action, cta }) => (
              <div key={k} className="card-surface group flex flex-col p-7 transition hover:-translate-y-1 hover:shadow-md">
                <div className="grid h-12 w-12 place-items-center rounded-md bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-primary">{t(`path.${k}.t`)}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{t(`path.${k}.d`)}</p>
                {to ? (
                  <Link to={to} className="btn-outline mt-6 w-fit !py-2.5 !text-xs">{cta} <ArrowRight className="h-3.5 w-3.5" /></Link>
                ) : (
                  <button onClick={action} className="btn-outline mt-6 w-fit !py-2.5 !text-xs">{cta} <ArrowRight className="h-3.5 w-3.5" /></button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISTRICTS */}
      <section className="section-y">
        <div className="container mx-auto container-px">
          <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">{t("sec.districts")}</h2>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {ALL_DISTRICTS.map((d) => (
              <Link
                key={d}
                to={`/properties?d=${d}`}
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium transition hover:border-[hsl(var(--teal))] hover:text-[hsl(var(--teal))]"
              >
                <MapPin className="h-3.5 w-3.5 text-[hsl(var(--teal))]" /> {t(`d.${d}`)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="bg-primary text-primary-foreground section-y">
        <div className="container mx-auto container-px">
          <h2 className="font-display text-3xl font-bold md:text-4xl">{t("sec.why")}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: MapPin, k: "why.local" },
              { icon: Search, k: "why.filters" },
              { icon: HomeIcon, k: "why.full" },
              { icon: Compass, k: "why.guided" },
              { icon: MessageSquare, k: "why.direct" },
              { icon: ShieldCheck, k: "why.simple" },
            ].map(({ icon: Icon, k }) => (
              <div key={k} className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[hsl(var(--gold))]/15 text-[hsl(var(--gold))]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium">{t(k)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SELL CTA */}
      <section className="section-y">
        <div className="container mx-auto container-px">
          <div className="card-surface grid items-center gap-8 p-8 md:grid-cols-[1fr_auto] md:p-12">
            <div>
              <h2 className="font-display text-2xl font-bold text-primary md:text-3xl">{t("sec.sellCta")}</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">{t("sec.sellCtaText")}</p>
            </div>
            <Link to="/sell" className="btn-primary md:!py-4"><Scale className="h-4 w-4" /> {t("cta.requestValuation")}</Link>
          </div>
        </div>
      </section>

      {/* FINAL */}
      <section className="section-y bg-secondary/40">
        <div className="container mx-auto container-px text-center">
          <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">{t("sec.finalTitle")}</h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/properties" className="btn-primary">{t("cta.browse")}</Link>
            <button onClick={openAssistant} className="btn-gold">{t("cta.findProperty")}</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-background px-3 py-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
