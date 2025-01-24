import { useNavigate } from 'react-router-dom'
import styles from './HomePage.module.scss'
import uuid from 'react-uuid'
import { useEffect } from 'react'
import useSocketStore from '@/shared/store/useSocketStore'
import { LinkButton } from './LinkButton/LinkButton'

export const HomePage = () => {
  const navigate = useNavigate()
  const { setSocket, socket } = useSocketStore()
  const handleLinkClick = () => {
    const roomId = uuid()
    navigate(`/playground/${roomId}`)
  }

  useEffect(() => {
    if (socket) {
      socket.disconnect()
      setSocket(null)
    }
  }, [])

  return (
    <div className={styles.container}>
      <img className={styles.logo} src="/logo.png" alt="codeX" />
      <LinkButton onClick={handleLinkClick} />
    </div>
  )
}
