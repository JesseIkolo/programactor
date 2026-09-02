import { notFound } from "next/navigation";
import { getContent, LANGS, type Lang } from "@/lib/content";

import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Services from "@/components/Services";
import Method from "@/components/Method";
import Labs from "@/components/Labs";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import {
  About,
  FinalCta,
  Manifesto,
  Rhythm,
  Stats,
  Testimonials,
} from "@/components/Misc";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();

  const l = lang as Lang;
  const c = getContent(l);

  return (
    <>
      <Nav c={c} lang={l} />
      <main>
        <Hero c={c} />
        <Manifesto c={c} />
        <Stats c={c} />
        <Rhythm c={c} />
        <About c={c} />
        <Work c={c} />
        <Services c={c} />
        <Method c={c} />
        <Labs c={c} />
        <Testimonials c={c} />
        <Pricing c={c} />
        <Faq c={c} />
        <FinalCta c={c} />
      </main>
      <Footer c={c} lang={l} />
    </>
  );
}
