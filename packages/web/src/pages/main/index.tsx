import { Flex } from "@chakra-ui/layout"
import type { NextPage } from "next"
import { useState } from "react"
import Background from "./components/Background"
import FirstSection from "./containers/FirstSection"
import Header from "./containers/Header"
import SecondSection from "./containers/SecondSection"
import { Developer } from "./types"

const Main: NextPage = () => {
  const [listaMembros, setListaMembros] = useState<Developer[]>([])
  const [termo, setTermo] = useState("")
  return (
    <Flex
      height="100vh"
      width="100%"
      margin="0 auto"
      direction="column"
      overflowX="hidden"
      alignItems="center"
    >
      <Background />
      <Header />
      <FirstSection setListaMembros={setListaMembros} termo={termo} />
      <SecondSection
        termo={termo}
        setTermo={setTermo}
        listaMembros={listaMembros}
        setListaMembros={setListaMembros}
      />
    </Flex>
  )
}

export default Main
