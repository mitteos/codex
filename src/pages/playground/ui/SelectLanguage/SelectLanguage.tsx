import cn from 'classnames'
import styles from './SelectLanguage.module.scss'
import useLanguageStore from '../../store/useLanguageStore'
import { useState } from 'react'

interface SelectLanguageProps {
  className?: string
}

const languages = [
  {
    id: 1,
    type: 'javascript'
  },
  {
    id: 2,
    type: 'typescript'
  }
]

export const SelectLanguage = ({ className }: SelectLanguageProps) => {
  const { language, setLanguage } = useLanguageStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <div className={cn(styles.container, className)}>
      <div
        className={cn(styles.selected, {
          [styles.open]: isOpen
        })}
        onClick={() => setIsOpen(!isOpen)}
      >
        <p>{language}</p>
        <svg
          className={cn(styles.arrow, {
            [styles.open]: isOpen
          })}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="11"
          viewBox="0 0 18 11"
          fill="none"
        >
          <path d="M1 1L9 9L17 1" stroke="#eee" strokeWidth="2" />
        </svg>
      </div>
      <div
        className={cn(styles.options, {
          [styles.open]: isOpen
        })}
      >
        {languages.map((lang) => (
          <div
            className={styles.option}
            key={lang.id}
            onClick={() => handleSetLanguage(lang.type)}
          >
            {lang.type}
          </div>
        ))}
      </div>
    </div>
  )
}
