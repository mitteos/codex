import { Editor } from '@monaco-editor/react'
import styles from './PlaygroundPage.module.scss'
import { useEffect, useRef, useState } from 'react'
import { OutputBlock } from './OutputBlock/OutputBlock'
import { Navbar } from './Navbar/Navbar'
import useUserStore from '@/shared/store/useUserStore'
import { useParams } from 'react-router-dom'
import { AuthModal } from './AuthModal/AuthModal'
import * as Y from 'yjs'
import { MonacoBinding } from 'y-monaco'
import { WebsocketProvider } from 'y-websocket'
import * as awarenessProtocol from 'y-protocols/awareness.js'
import { UserState } from '../types'
import { setUserColor } from '../helpers/setUserColor'
import useSocketStore from '@/shared/store/useSocketStore'
import { useResizablePanels } from '@/shared/helpers/useResizablePanels'
import { getUserColor } from '../helpers/getUserColor'

export const PlaygroundPage = () => {
  const editorBlockRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<any>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { name } = useUserStore()
  const { setSocket } = useSocketStore()
  const [usersList, setUsersList] = useState<UserState[]>([])
  const { id: roomId } = useParams()

  const { startResizing, stopResizing } = useResizablePanels(
    editorBlockRef,
    outputRef
  )

  useEffect(() => {
    if (!name) {
      setIsAuthModalOpen(true)
      return
    }
    setIsAuthModalOpen(false)
  }, [name])

  const handleMount = (editor: any) => {
    editorRef.current = editor

    const doc = new Y.Doc()
    const provider = new WebsocketProvider(
      `wss://codex-server-yjs.onrender.com/${roomId}`,
      `playground-${roomId}`,
      doc
    )
    setSocket(provider)

    const type = doc.getText('monaco')
    const awareness = provider.awareness

    new MonacoBinding(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      awareness
    )

    awareness.setLocalStateField('user', {
      userId: name,
      username: name,
      color: getUserColor(awareness)
    })

    awareness.on('change', () => {
      updateUserList()
    })

    updateUserList()

    function updateUserList() {
      const users: any[] = []
      awareness.getStates().forEach((state, clientId) => {
        if (state.user?.username) {
          users.push({
            id: state.user.userId,
            username: state.user?.username,
            color: state.user.color
          })

          setUserColor(clientId.toString(), state.user.color)
        }
      })
      setUsersList(users)
    }

    window.addEventListener('beforeunload', () => {
      awarenessProtocol.removeAwarenessStates(
        awareness,
        [doc.clientID],
        'window unload'
      )
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.input} ref={editorBlockRef}>
        <Navbar usersList={usersList} />
        {name && (
          <Editor
            className={styles.editor}
            height="100vh"
            defaultLanguage="javascript"
            theme="vs-dark"
            onMount={handleMount}
          />
        )}
      </div>
      <OutputBlock
        outRef={outputRef}
        startResizing={startResizing}
        stopResizing={stopResizing}
        code={editorRef.current?.getModel()?.getValue() || ''}
      />
      <AuthModal isOpen={isAuthModalOpen} />
    </div>
  )
}
