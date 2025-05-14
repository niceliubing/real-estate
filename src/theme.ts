import { theme as baseTheme } from '@chakra-ui/react'

const theme = {
  ...baseTheme,
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
  components: {
    Container: {
      baseStyle: {
        maxW: 'container.xl',
      },
    },
  },
};

export default theme;