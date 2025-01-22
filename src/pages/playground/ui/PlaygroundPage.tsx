import { Editor } from '@monaco-editor/react'
import styles from './PlaygroundPage.module.scss'
import { useEffect, useRef, useState } from 'react'
import { useDebounce } from '@/shared/helpers/useDebounce'
import cn from 'classnames'

type OutputState = {
  id: number
  type: 'log' | 'error' | 'warn' | 'info'
  component: React.ReactNode
}

export const PlaygroundPage = () => {
  const [output, setOutput] = useState<OutputState[]>([])
  const [code, setCode] = useState('')
  const editorRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const idCounterRef = useRef(0)

  const generateUniqueId = () => {
    idCounterRef.current += 1
    return idCounterRef.current
  }

  const executeCode = () => {
    try {
      const result = executeWithConsole()
      setOutput(result)
    } catch (error: any) {
      setOutput([
        {
          id: generateUniqueId(),
          type: 'error',
          component: <p>Ошибка: {error.message}</p>
        }
      ])
    }
  }
  const debouncedExecute = useDebounce(executeCode, 1000)

  function executeWithConsole() {
    const logs: OutputState[] = []
    const fakeConsole = {
      log: (...args: any[]) => {
        const formattedArgs = args.map((arg, index) => {
          if (typeof arg === 'object') {
            try {
              return (
                <p key={`${generateUniqueId()}-${index}`}>
                  {JSON.stringify(arg, null, 2)}
                </p>
              )
            } catch {
              return <p key={`${generateUniqueId()}-${index}`}>{String(arg)}</p>
            }
          }
          if (typeof arg === 'undefined') {
            return <p key={`${generateUniqueId()}-${index}`}>undefined</p>
          }
          if (typeof arg === 'string') {
            return <p key={`${generateUniqueId()}-${index}`}>{arg}</p>
          }
          return <p key={`${generateUniqueId()}-${index}`}>{String(arg)}</p>
        })
        logs.push({
          id: generateUniqueId(),
          type: 'log',
          component: formattedArgs
        })
      },
      error: (...args: any[]) => {
        const errorMessage = args.map((arg) => String(arg)).join(' ')
        logs.push({
          id: generateUniqueId(),
          type: 'error',
          component: <p key={generateUniqueId()}>🚫 Ошибка: {errorMessage}</p>
        })
      },
      warn: (...args: any[]) => {
        const warnMessage = args.map((arg) => String(arg)).join(' ')
        logs.push({
          id: generateUniqueId(),
          type: 'warn',
          component: <p key={generateUniqueId()}>⚠️ Warning: {warnMessage}</p>
        })
      },
      info: (...args: any[]) => {
        const infoMessage = args.map((arg) => String(arg)).join(' ')
        logs.push({
          id: generateUniqueId(),
          type: 'info',
          component: <p key={generateUniqueId()}>ℹ️ {infoMessage}</p>
        })
      }
    }

    try {
      const func = new Function('console', code)
      func(fakeConsole)
    } catch (err: any) {
      logs.push({
        id: generateUniqueId(),
        type: 'error',
        component: (
          <p key={generateUniqueId()}>🚫 Compilation error: {err.message}</p>
        )
      })
    }

    return logs
  }

  const handleChangeEditor = (e: string | undefined) => {
    setCode(e || '')
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
    document.body.style.cursor = 'default'
  }

  useEffect(() => {
    debouncedExecute()
  }, [code])

  return (
    <div className={styles.container}>
      <div className={styles.editor} ref={editorRef}>
        <Editor
          height="100vh"
          defaultLanguage="javascript"
          defaultValue="// Примеры использования консоли:
            console.log('Привет, мир!');
            console.log({ name: 'John', age: 30 });
            console.error('Это ошибка');
            console.warn('Это предупреждение');
            console.info('Это информационное сообщение');"
          theme="vs-dark"
          onChange={(e) => handleChangeEditor(e)}
        />
      </div>
      <div className={styles.output} ref={outputRef}>
        <span
          className={styles.resizer}
          onMouseDown={startResizing}
          onMouseUp={stopResizing}
        />
        <p className={styles.outputTitle}>Console output</p>
        <hr className={styles.outputSeparator} />
        <pre className={styles.outputContent}>
          {output.map((item, index) => (
            <div className={styles.outputWrapper} key={item.id}>
              <div
                key={item.id}
                className={cn(styles.outputItem, styles[item.type])}
              >
                {item.component}
              </div>
              {index !== output.length - 1 && (
                <span className={styles.separator} />
              )}
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}
