import { RateLimiterMemory } from 'rate-limiter-flexible'

export let rateLimiterInstance: null | RateLimiterMemory = null
const DURATION = 60
const POINTS = 30

export const initRateLimiter = () => {
  rateLimiterInstance = new RateLimiterMemory({
    points: POINTS,
    duration: DURATION,
  })
}
