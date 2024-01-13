import { INewPost, INewUser } from '@/types'
import { account, appwriteConfig, avatars, database, storage } from './config'
import { ID, Query } from 'appwrite'

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    )

    if (!newAccount) throw Error

    const avatarUrl = avatars.getInitials(user.name)

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    })

    return newUser
  } catch (error) {
    console.log(error)
    return error
  }
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string
  email: string
  name: string
  imageUrl: URL
  username?: string
}) {
  try {
    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      user
    )

    return newUser
  } catch (error) {
    console.log(error)
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password)

    return session
  } catch (error) {
    console.log(error)
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const currentAccount = await account.get()

    return currentAccount
  } catch (error) {
    console.log(error)
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount()

    if (!currentAccount) throw Error

    const currentUser = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser) throw Error

    return currentUser.documents[0]
  } catch (error) {
    console.log(error)
    return null
  }
}

// ========================== SignOut User
export async function signOutAccount() {
  try {
    const session = await account.deleteSession('current')
    return session
  } catch (e) {
    console.log(e)
  }
}

export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0])

    if (!uploadedFile) throw Error

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id)
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, '').split(',') || []

    // Create post
    const newPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    )

    if (!newPost) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    return newPost
  } catch (error) {
    console.log(error)
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    )

    return uploadedFile
  } catch (error) {
    console.log(error)
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      'top',
      100
    )

    if (!fileUrl) throw Error

    return fileUrl
  } catch (error) {
    console.log(error)
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)
    return { status: 'ok' }
  } catch (e) {
    console.log(e)
  }
}

export async function getRecentPosts() {
  const posts = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postsCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(20)]
  )
  if (!posts) throw new Error()
  return posts
}

// =============================== LIKED POSTS
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatePost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likesArray,
      }
    )
    if (!updatePost) {
      throw Error
    }
    return updatePost
  } catch (e) {
    console.log(e)
  }
}

// ============================== SAVED POSTS
export async function savePost(postId: string, userId: string) {
  try {
    const updatePost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    )
    if (!updatePost) throw new Error()
    return updatePost
  } catch (e) {
    console.log(e)
  }
}

// ============================== DELETE POSTS
export async function deletePost(saveRecordId: string) {
  try {
    const statusCode = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      saveRecordId
    )
    if (!statusCode) throw new Error()
    return { status: 'ok' }
  } catch (e) {
    console.log(e)
  }
}
