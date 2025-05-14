import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App'
import LoginForm from './components/LoginForm';
import './index.css'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginForm onSuccess={() => console.log('Logged in!')} />} />
        </Routes>
      </Router>
    </ChakraProvider>
  </React.StrictMode>,
)
