import { vi } from 'vitest'
import '@testing-library/jest-dom'

class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  constructor() {}
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)