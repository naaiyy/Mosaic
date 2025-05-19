"use client";

import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

interface SanitizedHtmlProps {
  html: string;
  className?: string;
}

/**
 * A component that safely renders HTML content after sanitizing it
 * to prevent XSS attacks.
 */
export default function SanitizedHtml({ html, className }: SanitizedHtmlProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState("");

  useEffect(() => {
    // Sanitize the HTML on the client side
    const clean = DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
    });
    setSanitizedHtml(clean);
  }, [html]);

  return (
    <div
      className={className}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: This HTML is sanitized with DOMPurify before rendering
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
