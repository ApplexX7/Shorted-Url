import { useEffect, useState, useRef, useCallback } from 'react';

type UrlEntity = {
  id: number;
  shortCode: string;
  longUrl: string;
  createdAt: string;
}

export default function Urls() {
  const [urls, setUrls] = useState<UrlEntity[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);

  const fetchUrls = useCallback(async (currentPage: number) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/urls?page=${currentPage}&limit=15`);
      const data = await res.json();
      if (data.length < 15) setHasMore(false);
      setUrls(prev => [...prev, ...data]);
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch first page
  useEffect(() => {
    fetchUrls(1);
  }, [fetchUrls]);

  // infinite scroll observer
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        pageRef.current += 1;
        fetchUrls(pageRef.current);
      }
    });

    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasMore, fetchUrls]);

  return (
    <div className='relative w-full p-10 text-center overflow-x-hidden'>
      <div className='sticky top-0 bg-gray-900 w-full py-3'>
        <h1 className='text-white text-4xl font-semibold mb-5'>All URLs</h1>
      </div>
      <ul className='flex flex-col gap-3'>
        {urls.map((url, index) => (
          <li key={index} className='text-white flex justify-between px-4 py-2 bg-gray-800 rounded-lg'>
            <span className='text-blue-400'>
              localhost:3000/{url.shortCode}
            </span>
            <span className='text-gray-400 mx-2'>→</span>
            <span className='truncate max-w-md'>{url.longUrl}</span>
          </li>
        ))}
      </ul>
      <div ref={bottomRef} className='py-4 text-center text-white'>
        {loading && <p className='text-blue-400'>Loading...</p>}
        {!hasMore && <p className='text-gray-500'>No more URLs</p>}
      </div>
    </div>
  )
}