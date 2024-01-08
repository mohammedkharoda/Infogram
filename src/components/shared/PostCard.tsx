import { Models } from "appwrite"

interface PostCardProps {
    post: Models.Document
}

const PostCard = ({ post }: PostCardProps) => {
    return (
        <div>{post.$id}</div>
    )
}

export default PostCard