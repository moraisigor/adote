import { Injectable } from '@nestjs/common'

import { MemoryStore } from '../memory.store'

const INCREMENT = `
  local amount = redis.call('INCR', KEYS[1])

  if amount == 1 then
    redis.call('PEXPIRE', KEYS[1], ARGV[1])
  end

  return amount
`

const json = <K>(value: K): string => JSON.stringify(value)

const object = <K>(value: string): K => JSON.parse(value) as K

@Injectable()
export class KeyMemoryProvider {
  constructor(private readonly memory: MemoryStore) {}

  async get<K>(key: string): Promise<K | null> {
    const value = await this.memory.client.get(key)

    if (value) {
      return object(value)
    }

    return null
  }

  async set<K>(key: string, time: number, value: K): Promise<void> {
    await this.memory.client.set(key, json(value), 'PX', String(time))
  }

  async remove(key: string): Promise<boolean> {
    const amount = await this.memory.client.del(key)

    return amount >= 1
  }

  async increment(key: string, time: number): Promise<number> {
    const amount = await this.memory.client.send('EVAL', [INCREMENT, '1', key, String(time)])

    return amount as number
  }
}
