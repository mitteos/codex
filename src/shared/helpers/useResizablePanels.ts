export const useResizablePanels = (
  leftBlockRef: React.RefObject<HTMLDivElement>,
  rightBlockRef: React.RefObject<HTMLDivElement>
) => {
  const handleMouseMove = (e: MouseEvent) => {
    if (leftBlockRef.current && rightBlockRef.current) {
      document.body.style.cursor = 'col-resize'
      leftBlockRef.current.style.width = `${(e.clientX / window.innerWidth) * 100}%`
      rightBlockRef.current.style.width = `${100 - (e.clientX / window.innerWidth) * 100}%`
    }
  }

  const startResizing = () => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', stopResizing)
  }

  const stopResizing = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', stopResizing)
    document.body.style.cursor = 'auto'
  }

  return { startResizing, stopResizing }
}
