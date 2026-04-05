"use client";

import { useEffect, useRef } from "react";

interface TwitterEmbedProps {
  url: string;
  title?: string | null;
}

export function TwitterEmbed({ url, title }: TwitterEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Twitter widgets.js if not already loaded
    const existingScript = document.querySelector(
      'script[src="https://platform.twitter.com/widgets.js"]'
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
    } else {
      // If script already exists, re-render widgets
      if (typeof (window as any).twttr !== "undefined") {
        (window as any).twttr.widgets?.load(containerRef.current);
      }
    }
  }, [url]);

  return (
    <div ref={containerRef} className="max-w-lg mx-auto">
      <blockquote className="twitter-tweet" data-theme="dark">
        {title && <p>{title}</p>}
        <a href={url}>{url}</a>
      </blockquote>
    </div>
  );
}
