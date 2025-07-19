export interface Auth {
  accessToken: string
  user: User
}


export interface User {
  id?: string
  nickname: string
  email: string
  password: string
  authorized: boolean
  admin: boolean
  authorizedText?: string
}
