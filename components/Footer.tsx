"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Facebook01Icon,
  NewTwitterIcon,
  InstagramIcon,
  WhatsappIcon,
  Mail01Icon,
  Call02Icon,
} from "hugeicons-react";
import { Mark, Wordmark } from "./ui";
import type { Content, Lang } from "@/lib/content";

export default function Footer({ c, lang }: { c: Content; lang: Lang }) {
  const other: Lang = lang === "fr" ? "en" : "fr";
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const isHome =
    !pathname ||
    pathname === `/${lang}` ||
    pathname === `/${lang}/` ||
    pathname === "/";
  const otherLangHref = pathname
    ? pathname.replace(new RegExp(`^/${lang}`), `/${other}`)
    : `/${other}`;

  // État local synchronisé avec l'API de contact
  const [contactInfo, setContactInfo] = useState({
    email: c.contact.email,
    phone: "+237 692 02 55 52",
    whatsapp: "+237 692 02 55 52",

    facebook: "https://facebook.com/programactor",
    twitter: "",
    instagram: c.contact.instagram,
    cities:
      lang === "fr"
        ? "Douala (sur place) · Libreville (visio)"
        : "Douala (on-site) · Libreville (remote)",
  });

  useEffect(() => {
    fetch("/api/settings/contact")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setContactInfo((prev) => ({
            ...prev,
            email: res.data.email || prev.email,
            phone: res.data.phone || prev.phone,
            whatsapp: res.data.whatsapp || prev.whatsapp,
            facebook: res.data.facebook || prev.facebook,
            twitter: "",
            instagram: res.data.instagram || prev.instagram,
          }));
        }
      })
      .catch(() => {
        // En cas d'erreur, conserve les valeurs par défaut
      });
  }, []);

  const getLinkHref = (rawHref: string) => {
    if (rawHref.startsWith("#")) {
      return isHome ? rawHref : `/${lang}${rawHref}`;
    }
    return rawHref;
  };

  const cleanWaNumber = contactInfo.whatsapp.replace(/[^0-9]/g, "");

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

            {/* Rangée Réseaux Sociaux Hugeicons */}
            <div className="mt-8 flex items-center gap-3">
              {contactInfo.whatsapp && (
                <a
                  href={`https://wa.me/${cleanWaNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp Studio"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[color:var(--color-muted)] transition-all hover:border-[#EBFF72] hover:bg-[#EBFF72]/10 hover:text-[#EBFF72]"
                  title="WhatsApp"
                >
                  <WhatsappIcon size={17} />
                </a>
              )}

              {contactInfo.facebook && (
                <a
                  href={contactInfo.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook Programactor"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[color:var(--color-muted)] transition-all hover:border-[#EBFF72] hover:bg-[#EBFF72]/10 hover:text-[#EBFF72]"
                  title="Facebook"
                >
                  <Facebook01Icon size={17} />
                </a>
              )}

              {contactInfo.instagram && (
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram Programactor"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[color:var(--color-muted)] transition-all hover:border-[#EBFF72] hover:bg-[#EBFF72]/10 hover:text-[#EBFF72]"
                  title="Instagram"
                >
                  <InstagramIcon size={17} />
                </a>
              )}
            </div>
          </div>

          <div>
            <p className="t-mono mb-6 text-[color:var(--color-muted-2)]">
              {c.footer.nav}
            </p>
            <ul className="flex flex-col gap-3">
              {c.nav.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={getLinkHref(l.href)}
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
            <ul className="flex flex-col gap-3.5 text-[15px]">
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-2.5 text-[color:var(--color-muted)] transition-colors hover:text-paper"
                >
                  <Mail01Icon size={15} className="text-[#EBFF72]/80" />
                  <span>{contactInfo.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${cleanWaNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-[color:var(--color-muted)] transition-colors hover:text-paper"
                >
                  <WhatsappIcon size={15} className="text-[#EBFF72]/80" />
                  <span>{contactInfo.whatsapp}</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+237692025552"
                  className="flex items-center gap-2.5 text-[color:var(--color-muted)] transition-colors hover:text-paper"
                >
                  <Call02Icon size={15} className="text-[#EBFF72]/80" />
                  <span>+237 692 02 55 52</span>
                </a>
              </li>
              <li className="pt-1 text-xs text-[color:var(--color-muted-2)]">
                {contactInfo.cities}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--color-hairline)] pt-7">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="t-mono text-[color:var(--color-muted-2)]">
              © {year} {c.brand}. {c.footer.rights}
            </p>
            <Link
              href={`/${lang}/mentions-legales`}
              className="t-mono text-xs text-[color:var(--color-muted-2)] transition-colors hover:text-paper hover:underline"
            >
              {lang === "en" ? "Legal Notices" : "Mentions Légales"}
            </Link>
            <Link
              href={`/${lang}/confidentialite`}
              className="t-mono text-xs text-[color:var(--color-muted-2)] transition-colors hover:text-paper hover:underline"
            >
              {lang === "en" ? "Privacy Policy" : "Confidentialité"}
            </Link>
          </div>
          <div className="t-mono flex items-center gap-4 text-[color:var(--color-muted-2)]">
            <span className="text-paper">{lang.toUpperCase()}</span>
            <Link href={otherLangHref} className="transition-colors hover:text-paper">
              {other.toUpperCase()}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
