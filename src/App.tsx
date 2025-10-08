import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header.tsx'
import Login from './components/Login.tsx'

const App: React.FC = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/header" element={<Header />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App