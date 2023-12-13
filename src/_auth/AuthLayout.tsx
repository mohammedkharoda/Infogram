import { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const AuthLayout = () => {
  const [randomImageUrl, setRandomImageUrl] = useState('')
  const isAuthenticated = false
  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const apiKey = import.meta.env.VITE_PEXELS_API_KEY
        const response = await fetch(
          `https://api.pexels.com/v1/curated?per_page=1`,
          {
            headers: {
              Authorization: apiKey,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch random image')
        }

        const data = await response.json()
        console.log(data)
        const imageUrl = data.photos[0]?.src?.original || ''

        setRandomImageUrl(imageUrl)
      } catch (error) {
        console.error(error)
      }
    }

    fetchRandomImage()
  }, [])
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>
          <img
            src={randomImageUrl}
            alt="logo"
            className="hidden xl:block h-full w-1/2 object-cover bg-no-repeat"
          />
        </>
      )}
    </>
  )
}

export default AuthLayout
