import { Flex } from "@chakra-ui/layout"
import type { NextPage } from "next"
import { useState } from "react"
import useDebouncedState from "../src/hooks/useDebouncedState"
import Background from "../src/pages/main/components/Background"
import FirstSection from "../src/pages/main/containers/FirstSection"
import Header from "../src/pages/main/containers/Header"
import SecondSection from "../src/pages/main/containers/SecondSection"
import { Developer } from "../src/pages/main/types"

const Home: NextPage = () => {
  const [listaMembros, setListaMembros] = useState<Developer[]>([])
  const [termo, setTermo] = useDebouncedState("")
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
      {/*<Stack spacing={20}>*/}
      <FirstSection setListaMembros={setListaMembros} termo={termo} />
      <SecondSection
        termo={termo}
        setTermo={setTermo}
        listaMembros={listaMembros}
        setListaMembros={setListaMembros}
      />
      {/*</Stack>*/}
    </Flex>
  )
}

export default Home

/**
<Flex direction="column" background="white" p={12} rounded={12}>
          <Heading mb={2} color="#3F4752">
            Adicione um novo dev!
          </Heading>
          <Text fontSize="md" mb={6}>
            Preencha os campos abaixo para aumentar nossa equipe.
          </Text>
          <SimpleGrid column={1} spacing={6}>
            <div>
              <Text mb={2}>Nome:</Text>
              <Input placeholder="Ex: Lucas Flores" variant="filled" />
            </div>
            <div>
              <Input
                as={InputMask}
                mask="99/99/9999"
                placeholder="Ex: 18/10/1996"
                variant="filled"
              />
            </div>
            <div>
              <Select variant="filled">
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
                <option value="O">Outros</option>
              </Select>
            </div>
            <div>
              <Input placeholder="Hobby" variant="filled" />
            </div>
          </SimpleGrid>
        </Flex>
 */
