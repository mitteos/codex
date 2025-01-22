import { Editor } from '@monaco-editor/react'
import styles from './PlaygroundPage.module.scss'
import { useRef, useState } from 'react'
import { OutputBlock } from './OutputBlock/OutputBlock'
import { Navbar } from './Navbar/Navbar'

export const PlaygroundPage = () => {
  const [code, setCode] = useState('')
  const editorRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className={styles.container}>
      <div className={styles.input} ref={editorRef}>
        <Navbar />
        <Editor
          className={styles.editor}
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
      <OutputBlock
        outRef={outputRef}
        startResizing={startResizing}
        stopResizing={stopResizing}
        code={code}
      />
    </div>
  )
}
