export interface Contact {
  id: string
  telegramId: number
  firstName?: string
  lastName?: string
  username?: string
  photo?: string
  public: boolean
  owner?: {
    id: string
    telegramId: number
  }
}
