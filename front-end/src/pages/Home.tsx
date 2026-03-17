import { useState } from 'react'
import { Link } from 'react-router-dom';
import React from 'react';

export default function Home() {
  const [urlList, setUrlList] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const createShortedUrl = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const longUrl = data.longestUrl;

    try {
      const res = await fetch('http://localhost:3000/post/newURl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl })
      });

      if (!res.ok) {
        const error = await res.json();
        setMessage(error.message);
      } else {
        const newUrl = await res.json();
        setUrlList([newUrl, ...urlList]);
        setMessage(null);
      }
    } catch (err) {
      setMessage('Something went wrong, please try again');
    }
  }
  return (
    <>
      <div className='w-full h-full flex  justify-center p-10'>
        <div className='w-full flex flex-col items-center gap-5'>
          <h1 className='text-whitesmooke font-semibold sm:text-6xl mb-10'>
            ShortenUrl
            <span className=' mt-10 text-sm text-blancasse/90 font-normal'> 
              by Mohammed Hilali
              </span>
          </h1>
          <form onSubmit ={createShortedUrl} className='m-5 text-center max-w-200 w-full'>
            <label htmlFor="url" 
              className='text-whitesmooke w-full text-3xl font-medium'> 
              Paste the URL to be shortened
            </label>
          <div className='flex items-center  w-full mt-2'>
            <input 
              type="text"
              id='url'
              name='longestUrl'
              className='py-3 px-5 focus:outline-3 bg-whitesmooke focus:outline-blue-700 w-full text-2xl text-black rounded-tl-xl rounded-bl-xl'
              placeholder='https://example.com/user/data/id?page="home"' />
            <button
              type="submit"
              className=' bg-blue-700 active:bg-blue-900 text-white text-2xl py-3 rounded-tr-xl rounded-br-xl px-5'>
              create
            </button>
          </div>
          </form>
          <div>
              <p className='text-white text-center text-xl font-medium mb-5 '>List of Shorted Url!</p>
              {!urlList.length ? (
              <p className='text-white text-center font-medium'>No url was founded :(</p>
              ) : (
                <ul className='flex flex-col gap-2'>
                        {urlList.slice(0, 15).map((url) => (
                        <li key={url.id} className='text-white'>
                        <span className='text-blue-400'>
                          localhost:3000/{url.shortCode}
                        </span>
                        {' → '}
                        {url.longUrl}
                        </li>
                  ))}
                 </ul>
              )}
          </div>
          <Link to="./urls" 
            className='bg-blue-700 text-2xl font-medium py-3 px-5 text-whitesmooke active:bg-blue-900 rounded-xl'>
            See more
          </Link>
        </div>
      </div>
    </>
  )
}