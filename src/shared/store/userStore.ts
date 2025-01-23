import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist, PersistOptions } from 'zustand/middleware'

interface UserStore {
  name: string
  userId: number
  setUser: (name: string, id: number) => void
}

type UserPersist = (
  config: StateCreator<UserStore>,
  options: PersistOptions<UserStore>
) => StateCreator<UserStore>

const useUserStore = create<UserStore>()(
  (persist as UserPersist)(
    (set) => ({
      name: '',
      userId: 0,
      setUser: (name: string, userId: number) => set({ name, userId })
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)

export default useUserStore
