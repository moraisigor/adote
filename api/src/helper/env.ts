export enum Env {
  TEST = 'test',
  DEVELOPMENT = 'development',
  PRODUCTION = 'production'
}

const get = (env?: string) => {
  const list: string[] = Object.values(Env)

  if (env) {
    if (list.includes(env)) {
      return env as Env
    }
  }

  throw new Error(`env is not valid: ${env}`)
}

export const env = get(process.env.ENV)

export const isDevelopment = env === Env.DEVELOPMENT

export const isProduction = env === Env.PRODUCTION
