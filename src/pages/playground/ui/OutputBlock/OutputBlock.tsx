import { useDebounce } from '@/shared/helpers/useDebounce'
import { OutputState } from '../../types'
import styles from './OutputBlock.module.scss'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import * as ts from 'typescript'

interface OutputBlockProps {
  outRef: React.RefObject<HTMLDivElement>
  startResizing: () => void
  stopResizing: () => void
  code: string
  language?: string
}

export const OutputBlock: React.FC<OutputBlockProps> = ({
  outRef,
  startResizing,
  stopResizing,
  code,
  language
}) => {
  const idCounterRef = useRef(0)
  const [output, setOutput] = useState<OutputState[]>([])

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
      let jsCode = code

      if (language === 'typescript') {
        try {
          jsCode = ts.transpileModule(code, {
            compilerOptions: {
              target: ts.ScriptTarget.ES2015,
              module: ts.ModuleKind.None
            }
          }).outputText
        } catch (transpileError: any) {
          logs.push({
            id: generateUniqueId(),
            type: 'error',
            component: (
              <p key={generateUniqueId()}>
                🚫 TypeScript Error: {transpileError.message}
              </p>
            )
          })
          return logs
        }
      }

      const func = new Function('console', jsCode)
      func(fakeConsole)
    } catch (err: any) {
      logs.push({
        id: generateUniqueId(),
        type: 'error',
        component: (
          <p key={generateUniqueId()}>🚫 Runtime error: {err.message}</p>
        )
      })
    }

    return logs
  }

  useEffect(() => {
    debouncedExecute()
  }, [code])

  return (
    <div className={styles.output} ref={outRef}>
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
  )
}
