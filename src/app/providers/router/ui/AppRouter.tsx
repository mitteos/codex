import { HomePage } from '@/pages/home'
import { PlaygroundPage } from '@/pages/playground'
import { BrowserRouter, Route, Routes } from 'react-router'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
