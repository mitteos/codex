import { USER_COLORS } from '@/shared/constants/colors/userColors'
import { Awareness } from 'y-protocols/awareness'

export const getUserColor = (awareness: Awareness) => {
  const usersColors: string[] = []

  awareness.getStates().forEach((state) => {
    if (state.user?.color) {
      usersColors.push(state.user.color)
    }
  })

  const color = USER_COLORS.filter((color) => !usersColors.includes(color))
  const randomColor = color[Math.floor(Math.random() * color.length)]
  return randomColor
}
