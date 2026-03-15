import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Urls from './pages/urls'

function App() {

  return (
      <div className='w-screen bg-gray-900  min-h-screen'>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/urls' element={<Urls />}/>
        </Routes>
      </div>
  )
}

export default App
