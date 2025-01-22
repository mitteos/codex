import { Link } from 'react-router-dom'
import styles from './authorLink.module.scss'
export const AuthorLink = () => {
  return (
    <Link
      className={styles.link}
      target="_blank"
      to="https://github.com/mitteos/vite-template"
    >
      author
    </Link>
  )
}
