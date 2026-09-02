import Link from "next/link";
import { Mark, Wordmark } from "./ui";
import type { Content, Lang } from "@/lib/content";

export default function Footer({ c, lang }: { c: Content; lang: Lang }) {
  const other: Lang = lang === "fr" ? "en" : "fr";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[color:var(--color-hairline)] pb-10 pt-16 md:pt-20">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <Mark
                className="h-5 w-auto text-paper"
                accent="var(--color-signal)"
                accentOpacity={1}
              />
              <Wordmark className="text-[19px] leading-none" />
            </div>
            <p className="t-lead mt-6 max-w-[30ch] text-[color:var(--color-muted)]">
              {c.footer.tagline}
            </p>
          </div>

          <div>
            <p className="t-mono mb-6 text-[color:var(--color-muted-2)]">
              {c.footer.nav}
            </p>
            <ul className="flex flex-col gap-3">
              {c.nav.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[15px] text-[color:var(--color-muted)] transition-colors hover:text-paper"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="t-mono mb-6 text-[color:var(--color-muted-2)]">
              {c.footer.contactLabel}
            </p>
            <ul className="flex flex-col gap-3 text-[15px]">
              <li>
                <a
                  href={`mailto:${c.contact.email}`}
                  className="text-[color:var(--color-muted)] transition-colors hover:text-paper"
                >
                  {c.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${c.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                  className="text-[color:var(--color-muted)] transition-colors hover:text-paper"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={c.contact.instagram}
                  className="text-[color:var(--color-muted)] transition-colors hover:text-paper"
                  rel="noreferrer"
                  target="_blank"
                >
                  Instagram
                </a>
              </li>
              <li className="text-[color:var(--color-muted-2)]">{c.cities}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--color-hairline)] pt-7">
          <p className="t-mono text-[color:var(--color-muted-2)]">
            © {year} {c.brand}. {c.footer.rights}
          </p>
          <div className="t-mono flex items-center gap-4 text-[color:var(--color-muted-2)]">
            <span className="text-paper">{lang.toUpperCase()}</span>
            <Link href={`/${other}`} className="transition-colors hover:text-paper">
              {other.toUpperCase()}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
