import { useEffect, useState } from 'react'
import { createApi } from 'unsplash-js'
import { Navigate, Outlet } from 'react-router-dom'
import 'ldrs/spiral'
const AuthLayout = () => {
  const [randomImageUrl, setRandomImageUrl] = useState('')
  const [imageLoaded, setImageLoaded] = useState(false)
  const isAuthenticated = false

  useEffect(() => {
    const unsplash = createApi({
      accessKey: import.meta.env.VITE_UNSPLASH_KEY,
    })

    unsplash.photos
      .getRandom({
        count: 1,
      })
      .then((res) => {
        setImageLoaded(true)
        const fetchedImages = res.response || []
        // @ts-expect-error because it is not typed
        const imageUrl = fetchedImages[0]?.urls?.full || ''
        console.log(fetchedImages)
        setRandomImageUrl(imageUrl)
      })
      .catch((error) => {
        console.error('Error fetching photos:', error)
        setImageLoaded(false)
      })
  }, [])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>
          {!imageLoaded ? (
            <div className="mx-auto w-[50%] flex items-center justify-center">
              {/* @ts-expect-error because it is not a expected tag */}
              <l-spiral size="50" speed="0.9" color="orange"></l-spiral>
            </div>
          ) : (
            <img
              src={randomImageUrl}
              alt="logo"
              className="hidden xl:block h-full w-1/2 object-cover bg-no-repeat"
              onLoad={handleImageLoad}
            />
          )}
        </>
      )}
    </>
  )
}

export default AuthLayout
