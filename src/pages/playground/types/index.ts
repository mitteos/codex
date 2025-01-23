export type OutputState = {
  id: number
  type: 'log' | 'error' | 'warn' | 'info'
  component: React.ReactNode
}

export type UserState = {
  id: string
  username: string
  color: string
}
