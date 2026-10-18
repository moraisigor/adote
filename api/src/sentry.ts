import * as Sentry from '@sentry/nestjs'

import { configuration } from './env.configuration'

const { ENV, SENTRY_KEY, SENTRY_RATE } = configuration

Sentry.init({
  dsn: SENTRY_KEY,
  environment: ENV,
  tracesSampleRate: SENTRY_RATE
})
