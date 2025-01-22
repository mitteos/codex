export type OutputState = {
  id: number
  type: 'log' | 'error' | 'warn' | 'info'
  component: React.ReactNode
}
