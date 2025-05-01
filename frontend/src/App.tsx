import { Routes, Route } from 'react-router-dom'
import { Box, Container, CssBaseline } from '@mui/material'
import Navbar from './components/Navbar'
import CustomerList from './pages/CustomerList'
import OrderList from './pages/OrderList'

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Navbar />
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Routes>
          <Route path="/" element={<CustomerList />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/orders" element={<OrderList />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App