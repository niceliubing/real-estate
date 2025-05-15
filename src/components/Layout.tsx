import { Box } from '@chakra-ui/react'
import { Header } from './Header'
import { Outlet } from 'react-router-dom'

export const Layout = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minH="100vh"
      minW="100vw"
      overflowX="hidden"
      bg="gray.50"
    >
      <Header />
      <Box
        as="main"
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
      >
        <Box
          maxW="container.xl"
          width="100%"
          px={{ base: 4, md: 6 }}
          py={{ base: 4, md: 6 }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default Layout
