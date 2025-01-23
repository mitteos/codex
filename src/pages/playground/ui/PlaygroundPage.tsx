import { Editor } from '@monaco-editor/react'
import styles from './PlaygroundPage.module.scss'
import { useEffect, useRef, useState } from 'react'
import { OutputBlock } from './OutputBlock/OutputBlock'
import { Navbar } from './Navbar/Navbar'
import useUserStore from '@/shared/store/userStore'
import { Bounce, toast, ToastContainer } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { AuthModal } from './AuthModal/AuthModal'
import { useDebounce } from '@/shared/helpers/useDebounce'

export const PlaygroundPage = () => {
  const [code, setCode] = useState('')
  const editorRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { name } = useUserStore()
  const { id: roomId } = useParams()

  const socket = useRef<WebSocket | null>(null)
  const initializeSocket = () => {
    socket.current = new WebSocket('wss://codex-server-1yeq.onrender.com')

    socket.current.onopen = () => {
      console.log('Connected to server')
      const message = {
        id: Date.now(),
        name: name,
        event: 'connection',
        roomId: roomId
      }
      socket.current?.send(JSON.stringify(message))
    }

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data)
      switch (message.event) {
        case 'message':
          setCode(message.message)
          break
        case 'connection':
          if (message.name === name) return
          toast.success(`${message.name} connected to server`, {
            position: 'bottom-center',
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'dark',
            transition: Bounce
          })
          break
      }
    }

    socket.current.onclose = (e) => {}

    socket.current.onerror = (e) => {}
  }

  useEffect(() => {
    if (!name) {
      setIsAuthModalOpen(true)
      return
    }
    setIsAuthModalOpen(false)
    initializeSocket()
  }, [name])

  const debouncedSendMessage = useDebounce((message: string) => {
    const messageData = {
      id: Date.now(),
      name: name,
      event: 'message',
      message: message,
      roomId: roomId
    }
    socket.current?.send(JSON.stringify(messageData))
  }, 300)

  const handleChangeEditor = (e: string | undefined) => {
    const newCode = e || ''
    setCode(newCode)
    debouncedSendMessage(newCode)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (editorRef.current && outputRef.current) {
      document.body.style.cursor = 'col-resize'
      editorRef.current.style.width = `${(e.clientX / window.innerWidth) * 100}%`
      outputRef.current.style.width = `${100 - (e.clientX / window.innerWidth) * 100}%`
    }
  }

  const startResizing = () => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', stopResizing)
  }

  const stopResizing = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', stopResizing)
    document.body.style.cursor = 'auto'
  }

  return (
    <div className={styles.container}>
      <div className={styles.input} ref={editorRef}>
        <Navbar />
        <Editor
          className={styles.editor}
          height="100vh"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={(e) => handleChangeEditor(e)}
        />
      </div>
      <OutputBlock
        outRef={outputRef}
        startResizing={startResizing}
        stopResizing={stopResizing}
        code={code}
      />
      <ToastContainer />
      <AuthModal isOpen={isAuthModalOpen} />
    </div>
  )
}
