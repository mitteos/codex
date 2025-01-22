import { Link } from 'react-router-dom'
import { AuthorLink } from './authorLink'
import styles from './HomePage.module.scss'

export const HomePage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome</h1>
      <AuthorLink />
      <Link to="/playground">Playground</Link>
    </div>
  )
}
