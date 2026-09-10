"use client";

/* ==========================================================================
   ANALYTICS — chargement des scripts de mesure.

   Trois briques indépendantes, chacune conditionnée à son identifiant :
   - Plausible : audience et événements (sans cookie, donc sans bandeau)
   - Meta Pixel : audiences et optimisation des campagnes Facebook/Instagram
   - TikTok Pixel : idem pour TikTok Ads

   Ajoute aussi la profondeur de lecture (25 / 50 / 75 %), qui dit où les
   visiteurs abandonnent la page.
   ========================================================================== */

import Script from "next/script";
import { useEffect, useRef } from "react";
import {
  META_PIXEL_ID,
  PLAUSIBLE_DOMAIN,
  TIKTOK_PIXEL_ID,
  track,
} from "@/lib/analytics";

function ScrollDepth() {
  const sent = useRef<Set<number>>(new Set());

  useEffect(() => {
    const marks = [25, 50, 75];

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = (window.scrollY / scrollable) * 100;

      for (const mark of marks) {
        if (pct >= mark && !sent.current.has(mark)) {
          sent.current.add(mark);
          track("scroll_depth", { depth: mark, path: window.location.pathname });
        }
      }
      if (sent.current.size === marks.length) {
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}

export default function Analytics() {
  return (
    <>
      {PLAUSIBLE_DOMAIN && (
        <Script
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.outbound-links.js"
          strategy="afterInteractive"
        />
      )}

      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');
          `}
        </Script>
      )}

      {TIKTOK_PIXEL_ID && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
ttq.setAndDefer=function(e,n){e[n]=function(){e.push([n].concat(Array.prototype.slice.call(arguments,0)))}};
for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
ttq.instance=function(e){for(var n=ttq._i[e]||[],i=0;i<ttq.methods.length;i++)ttq.setAndDefer(n,ttq.methods[i]);return n};
ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date;
ttq._o=ttq._o||{};ttq._o[e]=n||{};n=d.createElement("script");
n.type="text/javascript";n.async=!0;n.src=r+"?sdkid="+e+"&lib="+t;
e=d.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
ttq.load('${TIKTOK_PIXEL_ID}');
ttq.page();
}(window,document,'ttq');
          `}
        </Script>
      )}

      <ScrollDepth />
    </>
  );
}
