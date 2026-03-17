import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

const renderHome = () =>  render(
  <BrowserRouter>
    <Home />
  </BrowserRouter>
)


describe('Home Page', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  })

  it('should render the title', () => {
    renderHome()
    expect(screen.getByText(/ShortenUrl/i)).toBeInTheDocument()
  })

  it('should render the input field', () => {
    renderHome()
    expect(screen.getByPlaceholderText(/https:\/\/example.com/i)).toBeInTheDocument()
  })

  it('should render the create button', () => {
    renderHome()
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
  })

  it('should render empty state message when no URLs', () => {
    renderHome()
    expect(screen.getByText(/No urls yet/i)).toBeInTheDocument()
  })

  it('should call fetch when form is submitted', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        shortCode: 'abc123',
        longUrl: 'https://google.com',
        createdAt: new Date().toISOString()
      })
    })

    renderHome()

    const input = screen.getByPlaceholderText(/https:\/\/example.com/i)
    fireEvent.change(input, { target: { value: 'https://google.com' } })
    fireEvent.submit(screen.getByRole('button', { name: /create/i }).closest('form')!)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/post/newURl',
        expect.objectContaining({ method: 'POST' })
      )
    })
  })


  it('should display the new short URL after successful creation', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        shortCode: 'abc123',
        longUrl: 'https://google.com',
        createdAt: new Date().toISOString()
      })
    })
    renderHome()
    const input = screen.getByPlaceholderText(/https:\/\/example.com/i)
    fireEvent.change(input, { target: { value: 'https://google.com' } })
    fireEvent.submit(screen.getByRole('button', { name: /create/i }).closest('form')!)
    await waitFor(() => {
      expect(screen.getByText(/abc123/i)).toBeInTheDocument()
    })
  })

  it('should show error message when request fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid URL' })
    })

    renderHome()

    const input = screen.getByPlaceholderText(/https:\/\/example.com/i)
    fireEvent.change(input, { target: { value: 'not-a-url' } })
    fireEvent.submit(screen.getByRole('button', { name: /create/i }).closest('form')!)

    await waitFor(() => {
      expect(screen.getByText(/Invalid URL/i)).toBeInTheDocument()
    })
  })

})