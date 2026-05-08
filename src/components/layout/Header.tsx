import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Globe, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { LOCALES, Locale } from "@/lib/i18n";
import { openAssistant } from "@/lib/assistantStore";

export default function Header() {
  const { t, locale, setLocale } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => { setMobileOpen(false); }, [loc.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/properties", label: t("nav.properties") },
    { to: "/#match", label: t("nav.match"), action: () => openAssistant() },
    { to: "/sell", label: t("nav.sell") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-all ${
        scrolled ? "border-border bg-background/85 backdrop-blur-md" : "border-transparent bg-background"
      }`}
    >
      <div className="container mx-auto container-px flex h-16 items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 font-display text-base font-bold tracking-tight text-primary">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">G</span>
          <span className="hidden sm:inline whitespace-nowrap">General Real Estate</span>
        </Link>

        <nav className="hidden xl:flex items-center gap-1 min-w-0 flex-shrink">
          {links.map((l) =>
            l.action ? (
              <button
                key={l.to}
                onClick={l.action}
                className="relative px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors whitespace-nowrap hover:text-primary after:absolute after:bottom-1 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-[hsl(var(--gold))] after:transition-all hover:after:w-4/5"
              >
                {l.label}
              </button>
            ) : (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap after:absolute after:bottom-1 after:left-1/2 after:h-[2px] after:-translate-x-1/2 after:rounded-full after:bg-[hsl(var(--gold))] after:transition-all ${
                    isActive ? "text-primary after:w-4/5" : "text-foreground/80 hover:text-primary after:w-0 hover:after:w-4/5"
                  }`
                }
              >
                {l.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="hidden xl:flex items-center gap-2 shrink-0">
          <LangSwitcher locale={locale} setLocale={setLocale} />
          <button onClick={openAssistant} className="btn-primary whitespace-nowrap">
            <Search className="h-4 w-4" /> {t("cta.findProperty")}
          </button>
        </div>

        <button
          aria-label="Menu"
          className="xl:hidden rounded-md p-2 text-foreground hover:bg-secondary"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg animate-fade-in-fast xl:hidden flex flex-col">
          <div className="container mx-auto container-px flex h-16 items-center justify-between border-b border-border/50">
            <Link to="/" className="flex items-center gap-2 font-display text-base font-bold tracking-tight text-primary">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">G</span>
              <span>General Real Estate</span>
            </Link>
            <button aria-label={t("cta.close")} className="rounded-full p-2 text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground" onClick={() => setMobileOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="container mx-auto container-px flex flex-1 flex-col gap-2 overflow-y-auto py-8">
            {links.map((l) =>
              l.action ? (
                <button
                  key={l.to}
                  onClick={() => { setMobileOpen(false); l.action!(); }}
                  className="rounded-xl px-4 py-4 text-left text-xl font-semibold text-primary transition-colors hover:bg-secondary active:scale-[0.98]"
                >
                  {l.label}
                </button>
              ) : (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-4 text-xl font-semibold transition-colors active:scale-[0.98] ${
                      isActive ? "bg-primary/5 text-primary" : "text-primary/80 hover:bg-secondary hover:text-primary"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              )
            )}
            <div className="mt-8 mb-4 px-4">
              <LangSwitcher locale={locale} setLocale={setLocale} />
            </div>
            <div className="mt-auto pb-8 pt-4 px-4">
              <button
                onClick={() => { setMobileOpen(false); openAssistant(); }}
                className="btn-primary w-full py-4 text-base shadow-md whitespace-nowrap"
              >
                <Search className="h-5 w-5" /> {t("cta.findProperty")}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

const LOCALE_FLAG_CODES: Record<string, string> = {
  uk: "ua",
  en: "gb",
  ro: "ro",
};

function LangSwitcher({ locale, setLocale }: { locale: Locale; setLocale: (l: Locale) => void }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/80 p-1 shadow-sm backdrop-blur-sm">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          aria-label={`${l.label} language`}
          className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
            locale === l.code
              ? "bg-primary text-primary-foreground shadow-md scale-100"
              : "text-foreground/70 hover:bg-secondary hover:text-foreground hover:scale-105"
          }`}
        >
          <img
            src={`https://flagcdn.com/20x15/${LOCALE_FLAG_CODES[l.code]}.png`}
            srcSet={`https://flagcdn.com/40x30/${LOCALE_FLAG_CODES[l.code]}.png 2x`}
            width={20}
            height={15}
            alt={l.label}
            className="rounded-[2px] object-cover shadow-sm"
          />
          <span className="tracking-wide whitespace-nowrap">{l.label}</span>
        </button>
      ))}
    </div>
  );
}
