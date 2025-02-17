import { WebsocketProvider } from 'y-websocket'
import { create } from 'zustand'

interface SocketStore {
  socket: WebsocketProvider | null
  setSocket: (socket: WebsocketProvider) => void
  disconnect: () => void
}

const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.destroy()
      set({ socket: null })
    }
  }
}))

export default useSocketStore
