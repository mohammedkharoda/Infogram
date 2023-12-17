import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, database } from './config'
import { ID } from 'appwrite'

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    )
    if (!newAccount) throw Error('Account creation failed')

    const avatarUrl = avatars.getInitials(user.name)

    // creating new users
    const newUser = saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      imageUrl: avatarUrl,
      username: user.username,
    })
    return newUser
  } catch (error) {
    console.log(error)
  }
}

export async function saveUserToDB(user: {
  accountId: string
  email: string
  name: string
  imageUrl: URL
  username: string
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