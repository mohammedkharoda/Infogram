import GridPostList from './GridPostList'
import Loader from '@/components/shared/Loader.tsx'

type Props = {
  isSearchFetching: boolean
  searchedPosts: any
}

const SearchResults = ({ isSearchFetching, searchedPosts }: Props) => {
  if (isSearchFetching) {
    // @ts-expect-error because of frags
    return <Loader />
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    )
  }
}

export default SearchResults
