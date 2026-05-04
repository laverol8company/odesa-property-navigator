import { useLang } from "@/lib/LanguageContext";
import { Building2, Compass, MapPin, MessageSquare } from "lucide-react";

export default function About() {
  const { t } = useLang();
  return (
    <div>
      <section className="border-b border-border bg-secondary/40">
        <div className="container mx-auto container-px py-14">
          <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">{t("about.title")}</h1>
          <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{t("about.lead")}</p>
        </div>
      </section>
      <section className="container mx-auto container-px section-y">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5 text-foreground/90">
            <p>{t("about.p1")}</p>
            <p>{t("about.p2")}</p>
          </div>
          <div className="grid gap-3">
            {[
              { icon: MapPin, k: "why.local" },
              { icon: Building2, k: "why.full" },
              { icon: Compass, k: "why.guided" },
              { icon: MessageSquare, k: "why.direct" },
            ].map(({ icon: Icon, k }) => (
              <div key={k} className="card-surface flex items-center gap-3 p-4">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))]"><Icon className="h-5 w-5" /></div>
                <p className="text-sm font-semibold">{t(k)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
