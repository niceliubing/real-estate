import { ChakraProvider } from '@chakra-ui/react'
import { PropertyList } from './components/PropertyList'
import { Header } from './components/Header'

function App() {
  return (
    <ChakraProvider>
      <Header />
      <PropertyList />
    </ChakraProvider>
  )
}

export default App
