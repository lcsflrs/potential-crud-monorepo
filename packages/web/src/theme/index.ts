import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  fonts: {
    heading: "Blinker",
    body: "Blinker",
  },
  colors: {
    main: {
      100: "#D2D6D4",
      200: "#96A09E",
      300: "#798584",
      400: "#3E494E",
      500: "#202932",
      700: "#1C202C",
      800: "#181926",
      900: "#151320",
    },
  },
})

export default theme
