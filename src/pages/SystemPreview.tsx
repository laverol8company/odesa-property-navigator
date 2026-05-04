import { useEffect, useState } from "react";
import { useLang } from "@/lib/LanguageContext";
import { LockKeyhole, Mail, Inbox, MessageSquareReply, Workflow, Tag } from "lucide-react";

const KEY = "systemPreviewAccess";

export default function SystemPreview() {
  const { t } = useLang();
  const [granted, setGranted] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => { if (sessionStorage.getItem(KEY) === "1") setGranted(true); }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().toLowerCase() === "demo") {
      sessionStorage.setItem(KEY, "1");
      setGranted(true);
    } else setErr(t("sp.gate.err"));
  };

  if (!granted) {
    return (
      <div className="container mx-auto container-px section-y">
        <form onSubmit={submit} className="mx-auto max-w-md card-surface space-y-4 p-8">
          <div className="grid h-12 w-12 place-items-center rounded-md bg-primary text-primary-foreground"><LockKeyhole className="h-5 w-5" /></div>
          <h1 className="font-display text-2xl font-bold text-primary">{t("sp.gate.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("sp.gate.sub")}</p>
          <input className="input-base" placeholder={t("sp.gate.placeholder")} value={code} onChange={(e) => { setCode(e.target.value); setErr(""); }} />
          {err && <p className="text-xs text-[hsl(var(--destructive))]">{err}</p>}
          <button className="btn-primary w-full">{t("sp.gate.btn")}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto container-px section-y">
      <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">{t("sp.title")}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{t("sp.sub")}</p>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="card-surface p-6 lg:col-span-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--teal))]">
            <Inbox className="h-4 w-4" /> New lead
          </div>
          <h2 className="mt-2 font-display text-xl font-bold text-primary">Property Match Assistant — buyer</h2>
          <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 text-sm">
            <KV k="Source" v="Property Match Assistant" />
            <KV k="Intent" v="Buy" />
            <KV k="District" v="Arcadia" />
            <KV k="Budget" v="€150,000–€300,000" />
            <KV k="Type" v="Apartment" />
            <KV k="Rooms" v="2" />
            <KV k="Purpose" v="Living, Investment" />
            <KV k="Urgency" v="1–3 months" />
            <KV k="Locale" v="UA" />
          </dl>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recommended properties</p>
            <ul className="mt-2 space-y-2 text-sm">
              {["AR-305 — 3-room apartment 5 minutes from the sea","FB-220 — Apartment on French Boulevard","AR-201 — Bright 2-room apartment with park view"].map((x) => (
                <li key={x} className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
                  <Tag className="h-3.5 w-3.5 text-[hsl(var(--gold))]" /> {x}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-surface p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--teal))]"><MessageSquareReply className="h-4 w-4" /> Suggested reply</div>
            <p className="mt-3 text-sm text-foreground/90">
              «Доброго дня! Дякую за заявку. На основі ваших побажань підготували три варіанти в Аркадії в межах вашого бюджету. Коли вам зручно подивитися онлайн або наживо?»
            </p>
          </div>
          <div className="card-surface p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--teal))]"><Mail className="h-4 w-4" /> Email notification</div>
            <p className="mt-3 text-xs text-muted-foreground">Subject: New lead — Arcadia, Buy, €150k–€300k</p>
            <p className="mt-1 text-xs text-muted-foreground">To: agent@generalrealestate.od</p>
          </div>
          <div className="card-surface p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--teal))]"><Workflow className="h-4 w-4" /> Pipeline</div>
            <ol className="mt-3 space-y-2 text-sm">
              <li className="flex items-center justify-between"><span>New</span><span className="text-[hsl(var(--success))]">●</span></li>
              <li className="flex items-center justify-between text-muted-foreground"><span>Contacted</span><span>○</span></li>
              <li className="flex items-center justify-between text-muted-foreground"><span>Viewing scheduled</span><span>○</span></li>
              <li className="flex items-center justify-between text-muted-foreground"><span>Offer</span><span>○</span></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2.5">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{k}</dt>
      <dd className="mt-0.5 text-sm font-semibold">{v}</dd>
    </div>
  );
}
