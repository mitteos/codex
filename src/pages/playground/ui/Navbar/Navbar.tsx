import { Bounce, toast, ToastContainer } from 'react-toastify'
import styles from './Navbar.module.scss'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  const handleCopy = () => {
    navigator.clipboard.writeText('https://playground.com/aeAWfaWFA2FQA2')
    toast('Link copied to clipboard', {
      position: 'bottom-center',
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      transition: Bounce
    })
  }
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Link to="/" className={styles.logo}>
          <img className={styles.logoImage} src="/logo.png" alt="codeX" />
        </Link>
        <div className={styles.controls}>
          <div className={styles.link}>
            <input
              className={styles.linkInput}
              type="text"
              value="https://playground.com/aeAWfaWFA2FQA2"
            />
            <button className={styles.linkButton} onClick={handleCopy}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                className={styles.linkIcon}
              >
                <g id="Layer_100" data-name="Layer 100">
                  <path d="M44.84,10.5H24.9a5,5,0,0,0-5,5V42.8a5,5,0,0,0,5,5H44.84a5,5,0,0,0,5-5V15.46A5,5,0,0,0,44.84,10.5Zm2,32.3a2,2,0,0,1-2,2H24.9a2,2,0,0,1-2-2V15.46a2,2,0,0,1,2-2H44.84a2,2,0,0,1,2,2Z" />
                  <path d="M39.07,50.5H19.18a2,2,0,0,1-2-2V21.23a1.5,1.5,0,0,0-3,0V48.51a5,5,0,0,0,5,5H39.07A1.5,1.5,0,0,0,39.07,50.5Z" />
                </g>
              </svg>
            </button>
          </div>
          <div className={styles.user}>
            <p className={styles.userItem}>A</p>
            <p className={styles.userItem}>D</p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
