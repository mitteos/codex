import { WebsocketProvider } from 'y-websocket'
import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist, PersistOptions } from 'zustand/middleware'

interface SocketStore {
  socket: WebsocketProvider | null
  setSocket: (socket: WebsocketProvider | null) => void
}

type SocketPersist = (
  config: StateCreator<SocketStore>,
  options: PersistOptions<SocketStore>
) => StateCreator<SocketStore>

const useSocketStore = create<SocketStore>()(
  (persist as SocketPersist)(
    (set) => ({
      socket: null,
      setSocket: (socket: WebsocketProvider | null) => set({ socket })
    }),
    {
      name: 'socket',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)

export default useSocketStore
