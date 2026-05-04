import { Link } from "react-router-dom";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border bg-[#0E141A] text-[hsl(42,30%,92%)]">
      <div className="container mx-auto container-px py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))]">G</span>
              General Real Estate
            </div>
            <p className="mt-4 max-w-md text-sm text-white/60">{t("footer.tag")}</p>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">{t("footer.nav")}</p>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-[hsl(var(--gold))]" to="/properties">{t("nav.properties")}</Link></li>
              <li><Link className="hover:text-[hsl(var(--gold))]" to="/sell">{t("nav.sell")}</Link></li>
              <li><Link className="hover:text-[hsl(var(--gold))]" to="/about">{t("nav.about")}</Link></li>
              <li><Link className="hover:text-[hsl(var(--gold))]" to="/contact">{t("nav.contact")}</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">{t("footer.contact")}</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-[hsl(var(--gold))]" /> +380 00 000 0000</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-[hsl(var(--gold))]" /> info@generalrealestate.od</li>
              <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[hsl(var(--gold))]" /> WhatsApp</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[hsl(var(--gold))]" /> {t("contact.officeVal")}</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/45">
          {t("footer.rights", { y: year })}
        </div>
      </div>
    </footer>
  );
}
