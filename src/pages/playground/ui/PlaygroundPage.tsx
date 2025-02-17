import { Editor } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
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
import useLanguageStore from '../store/useLanguageStore'

export const PlaygroundPage = () => {
  const editorBlockRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<any>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { name } = useUserStore()
  const { setSocket } = useSocketStore()
  const [usersList, setUsersList] = useState<UserState[]>([])
  const { id: roomId } = useParams()
  const { language, setLanguage } = useLanguageStore()
  const [yDoc, setYDoc] = useState<Y.Doc | null>(null)

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

  useEffect(() => {
    if (yDoc && language) {
      const sharedLanguage = yDoc.getMap('language')
      sharedLanguage.set('current', language)
    }
  }, [language, yDoc])

  useEffect(() => {
    return () => {
      if (yDoc) {
        yDoc.destroy()
      }
    }
  }, [yDoc])

  const handleMount = (editor: any) => {
    editorRef.current = editor

    const doc = new Y.Doc()
    setYDoc(doc)

    const provider = new WebsocketProvider(
      `wss://codex-server-yjs.onrender.com/${roomId}`,
      `playground-${roomId}`,
      doc
    )
    setSocket(provider)

    const sharedLanguage = doc.getMap('language')

    if (!sharedLanguage.get('current')) {
      sharedLanguage.set('current', language)
    } else {
      setLanguage(sharedLanguage.get('current') as string)
    }

    sharedLanguage.observe(() => {
      const newLanguage = sharedLanguage.get('current')
      setLanguage(newLanguage as string)

      if (editorRef.current) {
        const model = editorRef.current.getModel()
        monaco.editor.setModelLanguage(model, newLanguage as string)
      }
    })

    const type = doc.getText('monaco')
    const awareness = provider.awareness
    const model = editorRef.current.getModel()
    model.setEOL(1)

    new MonacoBinding(type, model, new Set([editorRef.current]), awareness)

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
            defaultLanguage={language}
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
