import { INewUser } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { createUserAccount, signInAccount } from '../appwrite/api'

export const useCreateUserAccountMutation = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  })
}

export const useSignInAccountMutation = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  })
}
