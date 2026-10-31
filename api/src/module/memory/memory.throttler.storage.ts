import { Injectable } from '@nestjs/common'
import type { ThrottlerStorage } from '@nestjs/throttler'

import { MemoryStore } from './memory.store'

const EVAL = `
  local block = redis.call('PTTL', KEYS[2])
  local expire = redis.call('PTTL', KEYS[1])
  local amount = redis.call('INCR', KEYS[1])

  if block > 0 then
    return { block, 0, tonumber(ARGV[2]) + 1 }
  end

  if amount == 1 then
    redis.call('PEXPIRE', KEYS[1], ARGV[1])
  end

  if amount <= tonumber(ARGV[2]) then
    return { 0, expire, amount }
  end

  if tonumber(ARGV[3]) <= 0 then
    return { block, expire, amount }
  end

  redis.call('SET', KEYS[2], 1, 'PX', ARGV[3])
  redis.call('DEL', KEYS[1])

  return { tonumber(ARGV[3]), expire, amount }
`

const seconds = (value: number) => Math.round(value / 1000)

@Injectable()
export class MemoryThrottlerStorage implements ThrottlerStorage {
  constructor(private readonly memory: MemoryStore) {}

  async increment(key: string, time: number, limit: number, duration: number, name: string) {
    const result = await this.memory.client.send('EVAL', [
      EVAL,
      '2',
      `throttler:${name}:${key}`,
      `throttler:${name}:${key}:block`,
      String(time),
      String(limit),
      String(duration)
    ])

    const [block, expire, amount] = result as [number, number, number]

    return {
      isBlocked: block >= 1,
      timeToExpire: seconds(expire),
      timeToBlockExpire: seconds(block),
      totalHits: amount
    }
  }
}
