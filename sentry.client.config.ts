import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.05,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event) {
      // Data sanitization: redact potential sensitive user input
      if (event.request?.data) {
        try {
          const data = typeof event.request.data === "string" ? JSON.parse(event.request.data) : event.request.data;
          delete data.password;
          delete data.otp;
          delete data.token;
          delete data.secret;
          event.request.data = JSON.stringify(data);
        } catch {
          // Ignore JSON parse errors
        }
      }
      return event;
    },
  });
}
