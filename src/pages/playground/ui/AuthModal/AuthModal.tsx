import useUserStore from '@/shared/store/userStore'
import styles from './AuthModal.module.scss'
import cn from 'classnames'
import { useState } from 'react'

interface AuthModalProps {
  isOpen: boolean
}

export const AuthModal = ({ isOpen }: AuthModalProps) => {
  const { setUser } = useUserStore()
  const [name, setName] = useState('')
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUser(name, Date.now())
  }

  return (
    <div className={cn(styles.container, { [styles.open]: isOpen })}>
      <div className={styles.content}>
        <h1 className={styles.title}>Enter your name</h1>
        <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
          <input
            className={styles.input}
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className={styles.button} type="submit">
            Enter
          </button>
        </form>
        <img src="/logo.png" alt="codeX" className={styles.logo} />
      </div>
    </div>
  )
}
