import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header/Header.tsx'
import LogInPage from './pages/LogInPage/Login.tsx';
import HomePage from './pages/HomePage/HomePage.tsx';

const App: React.FC = () => {

  return (
    <BrowserRouter>
            <Routes>
                {/* หน้า Login ไม่มี Header */}
                <Route path="/login" element={<LogInPage />} />
                
                {/* หน้าอื่นๆ มี Header */}
                <Route
                    path="/*"
                    element={
                        <>
                            <Header />
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                {/* เพิ่มหน้าอื่นๆ ตรงนี้ */}
                            </Routes>
                        </>
                    }
                />
            </Routes>
        </BrowserRouter>
  )
}

export default App