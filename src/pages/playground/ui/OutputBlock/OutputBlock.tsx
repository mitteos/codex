import { useDebounce } from '@/shared/helpers/useDebounce'
import { OutputState } from '../../types'
import styles from './OutputBlock.module.scss'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'

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
  code
}) => {
  const [output, setOutput] = useState<OutputState[]>([])
  const idCounterRef = useRef(0)

  const generateId = () => {
    idCounterRef.current += 1
    return idCounterRef.current
  }

  const safeEval = (code: any) => {
    try {
      const originalLog = console.log
      const originalError = console.error
      const originalWarn = console.warn
      const originalInfo = console.info

      const logs: OutputState[] = []

      console.log = (...args) =>
        logs.push({
          id: generateId(),
          type: 'log' as const,
          component: args.map((arg) => JSON.stringify(arg, null, 2)).join(' ')
        })
      console.error = (...args) =>
        logs.push({
          id: generateId(),
          type: 'error' as const,
          component: args.map((arg) => JSON.stringify(arg, null, 2)).join(' ')
        })
      console.warn = (...args) =>
        logs.push({
          id: generateId(),
          type: 'warn' as const,
          component: args.map((arg) => JSON.stringify(arg, null, 2)).join(' ')
        })
      console.info = (...args) =>
        logs.push({
          id: generateId(),
          type: 'info' as const,
          component: args.map((arg) => JSON.stringify(arg, null, 2)).join(' ')
        })
      try {
        eval(code)
      } catch (e: any) {
        logs.push({
          id: generateId(),
          type: 'error' as const,
          component: e.message
        })
      }

      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
      console.info = originalInfo

      return logs
    } catch (error: any) {
      return [
        {
          id: generateId(),
          type: 'error' as const,
          component: error.message
        }
      ]
    }
  }

  const handleRunCode = () => {
    const logs = safeEval(code)
    setOutput(logs)
  }

  const debouncedHandleRunCode = useDebounce(handleRunCode, 1000)

  useEffect(() => {
    debouncedHandleRunCode()
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
            <div className={cn(styles.outputItem, styles[item.type])}>
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
