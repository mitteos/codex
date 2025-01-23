import styles from './LinkButton.module.scss'

interface LinkButtonProps {
  onClick: () => void
}

export const LinkButton: React.FC<LinkButtonProps> = ({ onClick }) => {
  return (
    <div className={styles.buttons}>
      <button className={styles.btn} onClick={onClick}>
        <span></span>
        <p
          data-start="good luck!"
          data-text="Playground"
          data-title="Start"
        ></p>
      </button>
    </div>
  )
}
