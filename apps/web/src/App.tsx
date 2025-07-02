import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './providers/AppProvider'
import { HomePage } from './features/home/HomePage'
import { ShrineMapPage } from './features/shrine/ShrineMapPage'
import { VisitHistoryPage } from './features/visit/VisitHistoryPage'
import { ProfilePage } from './features/profile/ProfilePage'
import { Layout } from './components/layout/Layout'

const App: React.FC = () => {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shrine" element={<ShrineMapPage />} />
          <Route path="/visit" element={<VisitHistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
    </AppProvider>
  )
}

export default App