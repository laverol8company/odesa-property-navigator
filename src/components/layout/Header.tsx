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
    { to: "/match", label: t("nav.match"), action: () => openAssistant() },
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
      <div className="container mx-auto container-px flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display text-base font-bold tracking-tight text-primary">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">G</span>
          <span className="hidden sm:inline">General Real Estate</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) =>
            l.action ? (
              <button
                key={l.to}
                onClick={l.action}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </button>
            ) : (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary ${
                    isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
                  }`
                }
              >
                {l.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LangSwitcher locale={locale} setLocale={setLocale} />
          <button onClick={openAssistant} className="btn-primary">
            <Search className="h-4 w-4" /> {t("cta.findProperty")}
          </button>
        </div>

        <button
          aria-label="Menu"
          className="lg:hidden rounded-md p-2 text-foreground hover:bg-secondary"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-background animate-fade-in-fast lg:hidden">
          <div className="container mx-auto container-px flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-display font-bold text-primary">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">G</span>
              <span>General Real Estate</span>
            </Link>
            <button aria-label={t("cta.close")} className="rounded-md p-2 hover:bg-secondary" onClick={() => setMobileOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="container mx-auto container-px flex flex-col gap-1 pt-4">
            {links.map((l) =>
              l.action ? (
                <button
                  key={l.to}
                  onClick={() => { setMobileOpen(false); l.action!(); }}
                  className="rounded-md px-3 py-4 text-left text-lg font-medium text-foreground hover:bg-secondary"
                >
                  {l.label}
                </button>
              ) : (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className="rounded-md px-3 py-4 text-lg font-medium text-foreground hover:bg-secondary"
                >
                  {l.label}
                </NavLink>
              )
            )}
            <div className="mt-4 flex items-center gap-2 px-3">
              <LangSwitcher locale={locale} setLocale={setLocale} />
            </div>
            <button
              onClick={() => { setMobileOpen(false); openAssistant(); }}
              className="btn-primary mt-6 w-full"
            >
              <Search className="h-4 w-4" /> {t("cta.findProperty")}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function LangSwitcher({ locale, setLocale }: { locale: Locale; setLocale: (l: Locale) => void }) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-md border border-border bg-card p-0.5">
      <Globe className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" />
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          aria-label={`${l.label} language`}
          className={`rounded px-2 py-1 text-xs font-semibold transition-colors ${
            locale === l.code ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-secondary"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
