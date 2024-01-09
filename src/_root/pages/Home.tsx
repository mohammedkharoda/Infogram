import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/PostCard';
import { useGetRecentposts } from '@/lib/react-query/queriesAndMutation';
import { Models } from 'appwrite';

const Home = () => {
  const post = null;
  const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentposts()
  return <div className='flex flex-col'>
    <div className='home-container'>
      <div className='home-posts'>
        <h2 className='h3-bold md:h2-bold text-left w-full'>Home Feed</h2>
        {isPostLoading && !post ? (
          // @ts-expect-error becuase of JSX is Void
          <Loader />
        ) : (
          <ul className='flex flex-col flex-1 gap-9 w-full'>{posts?.documents.map((post: Models.Document) => {
            return (
              <PostCard post={post} />
            )
          })}</ul>
        )}
      </div>
    </div>
  </div>
}

export default Home
