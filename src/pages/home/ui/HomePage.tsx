import { useNavigate } from 'react-router-dom'
import styles from './HomePage.module.scss'
import uuid from 'react-uuid'
import { useEffect } from 'react'
import useSocketStore from '@/shared/store/useSocketStore'

export const HomePage = () => {
  const navigate = useNavigate()
  const { setSocket, socket } = useSocketStore()
  const handleLinkClick = () => {
    const roomId = uuid()
    navigate(`/playground/${roomId}`)
  }

  useEffect(() => {
    if (socket) {
      socket.close()
      setSocket(null)
    }
  }, [])

  return (
    <div className={styles.container}>
      <img className={styles.logo} src="/logo.png" alt="codeX" />
      <div className={styles.buttons}>
        <button className={styles.btn} onClick={handleLinkClick}>
          <span></span>
          <p
            data-start="good luck!"
            data-text="Playground"
            data-title="Start"
          ></p>
        </button>
      </div>
    </div>
  )
}
