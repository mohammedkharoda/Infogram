import { Models } from 'appwrite'
import {
  useDeletePost,
  useLikePost,
  useSavePost,
} from '@/lib/react-query/queriesAndMutation.ts'
import { useUserContext } from '@/context/AuthContext.tsx'
import { useState } from 'react'
import { checkIsLiked } from '@/lib/utils.ts'

interface PostCardStatsProps {
  user: string
  post: Models.Document
}

const PostCardStats = ({ user, post }: PostCardStatsProps) => {
  const likesList = post.likes.map((user: Models.Document) => user.$id)
  const [likes, setLikes] = useState(likesList)
  const [IsSaved, setIsSaved] = useState(false)

  const { mutate: likePost } = useLikePost()
  const { mutate: savePost } = useSavePost()
  const { mutate: deleteSavedPost } = useDeletePost()
  const { data: currentUser } = useUserContext()
  const handleLikePost = () => {}
  const handleSavepost = () => {}

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, user)
              ? '/assets/icons/liked.svg'
              : '/assets/icons/like.svg'
          }`}
          alt="liked"
          width={20}
          height={20}
          onClick={() => {}}
        />
        <p className="small-medium lg:base-medium">0</p>
      </div>
      {/*save*/}
      <div className="flex gap-2">
        <img
          src="/assets/icons/save.svg"
          alt="liked"
          width={20}
          height={20}
          onClick={() => {}}
        />
      </div>
    </div>
  )
}
export default PostCardStats
