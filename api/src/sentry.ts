import * as Sentry from '@sentry/nestjs'

Sentry.init({
  dsn: process.env.SENTRY_KEY,
  environment: process.env.ENV,
  tracesSampleRate: Number(process.env.SENTRY_RATE)
})
