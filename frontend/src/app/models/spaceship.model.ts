export interface Spaceship {
  id?: string
  name: string
  nickname: string
  quantity: number
  userId: string
}

export interface CcuSpaceship {
  name: string
  shipname: string
}

export interface GuildSpaceship {
  owner: string
  name: string
  nickname: string
  quantity: number
}
