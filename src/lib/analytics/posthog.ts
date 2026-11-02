"use client";

import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window !== "undefined") {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

    if (posthogKey) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        capture_pageview: false, // Handled manually for privacy compliance
        capture_pageleave: true,
        autocapture: false, // Strict privacy: only capture approved product actions
        sanitize_properties: (properties) => {
          // Explicitly strip passwords, tokens, and sensitive document paths
          delete properties["password"];
          delete properties["token"];
          delete properties["secret"];
          delete properties["otp"];
          delete properties["resume"];
          return properties;
        },
      });
    }
  }
}

/**
 * Capture an analytics event with privacy safety
 */
export function captureEvent(eventName: string, properties?: Record<string, unknown>) {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.capture(eventName, properties);
  }
}
