import * as Sentry from '@sentry/nestjs'

Sentry.init({
  dsn: '',
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0
})
