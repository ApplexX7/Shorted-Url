import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Urls from '../pages/urls'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

const mockUrls = [
  { id: 1, shortCode: 'abc123', longUrl: 'https://google.com', createdAt: '2026-03-16T00:00:00.000Z' },
  { id: 2, shortCode: 'xyz789', longUrl: 'https://github.com', createdAt: '2026-03-16T00:00:00.000Z' },
]

const renderUrls = () => render(
  <BrowserRouter>
    <Urls />
  </BrowserRouter>
)

describe('Urls Page', () => {

  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should render the title', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    renderUrls()
    expect(screen.getByText(/All URLs/i)).toBeInTheDocument()
  })

  it('should show loading state initially', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    renderUrls()
    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
  })

  it('should render list of URLs after fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUrls
    })

    renderUrls()

    await waitFor(() => {
      expect(screen.getByText(/abc123/i)).toBeInTheDocument()
      expect(screen.getByText(/xyz789/i)).toBeInTheDocument()
    })
  })

  it('should show no more URLs when list is less than 15', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUrls
    })

    renderUrls()

    await waitFor(() => {
      expect(screen.getByText(/No more URLs/i)).toBeInTheDocument()
    })
  })

  it('should display shortCode and longUrl for each item', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUrls
    })

    renderUrls()

    await waitFor(() => {
      expect(screen.getByText(/https:\/\/google.com/i)).toBeInTheDocument()
      expect(screen.getByText(/https:\/\/github.com/i)).toBeInTheDocument()
    })
  })
})