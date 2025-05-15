import { Box } from '@chakra-ui/react'
import { Header } from './Header'
import { Outlet } from 'react-router-dom'

export const Layout = () => {
  return (
    <>
      <Header />
      <Box minH="90vh">
        <Outlet />
      </Box>
    </>
  )
}

export default Layout
