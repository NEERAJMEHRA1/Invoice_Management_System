import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/dashboard/Home'
import DashboardLayout from './components/DashboardLayout'
import Customer from './pages/dashboard/Customer'
import Invoice from './pages/dashboard/Invoice'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="" element={<Home />} />
            <Route path="customers" element={<Customer />} />
            <Route path="invoices" element={<Invoice />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
