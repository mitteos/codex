import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist, PersistOptions } from 'zustand/middleware'

interface SocketStore {
  socket: WebSocket | null
  setSocket: (socket: WebSocket | null) => void
}

type SocketPersist = (
  config: StateCreator<SocketStore>,
  options: PersistOptions<SocketStore>
) => StateCreator<SocketStore>

const useSocketStore = create<SocketStore>()(
  (persist as SocketPersist)(
    (set) => ({
      socket: null,
      setSocket: (socket: WebSocket | null) => set({ socket })
    }),
    {
      name: 'socket',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)

export default useSocketStore
