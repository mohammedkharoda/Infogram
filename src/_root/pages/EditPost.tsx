import PostForm from '@/components/forms/PostForm'
import { useParams } from 'react-router-dom'
import { useGetPostById } from '@/lib/react-query/queriesAndMutation.ts'
import Loader from '@/components/shared/Loader.tsx'

const EditPost = () => {
  const { id } = useParams()
  const { data: post, isPending } = useGetPostById(id || '')
  if (isPending) {
    // @ts-expect-error because not a jsx fragment
    return <Loader />
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Posts</h2>
        </div>
        <PostForm action="Update" post={post} />
      </div>
    </div>
  )
}

export default EditPost
