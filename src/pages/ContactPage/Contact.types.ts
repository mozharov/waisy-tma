export interface Contact {
  id: string
  telegramId: number
  name?: string
  username?: string
  photo?: string
  public: boolean
  owner: {
    id: string
    telegramId: number
  }
}
