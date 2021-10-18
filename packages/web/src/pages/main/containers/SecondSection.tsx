import { Button } from "@chakra-ui/button"
import { useDisclosure } from "@chakra-ui/hooks"
import { Input } from "@chakra-ui/input"
import { Center, Container, Divider, Flex, Stack } from "@chakra-ui/layout"
import { CircularProgress } from "@chakra-ui/progress"
import { Heading } from "@chakra-ui/react"
import { Select } from "@chakra-ui/select"
import { Tooltip } from "@chakra-ui/tooltip"
import { Collapse } from "@chakra-ui/transition"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { AiFillFilter } from "react-icons/ai"
import api from "../../../api"
import CardList from "../../../components/CardList"
import NoResultMessage from "../../../components/NoResultMessage"
import { Developer } from "../types"

interface Props {
  listaMembros: Developer[]
  setListaMembros: Dispatch<SetStateAction<Developer[]>>
  setTermo: Dispatch<SetStateAction<string>>
  termo: string
}

const SecondSection = ({ listaMembros, setListaMembros, setTermo, termo }: Props) => {
  const [loading, setLoading] = useState(false)
  const { onToggle, isOpen } = useDisclosure()
  const [notFound, setNotFound] = useState(false)
  const [filterSexo, setFilterSexo] = useState("")

  useEffect(() => {
    setLoading(true)
    const arrayAuxiliar: Developer[] = [] // Utilizado para auxiliar o manejo do `data` que vem da requisição
    api
      .get(`/${termo}${!filterSexo ? `` : `?sexo=${filterSexo}`}`)
      .then((response) => {
        if (!Array.isArray(response.data)) {
          arrayAuxiliar.push(response.data as Developer)
          setListaMembros(arrayAuxiliar)
          setNotFound(false)
        } else if (response.data) {
          setListaMembros(response.data as Developer[])
          setNotFound(false)
        }
      })
      .catch((err) => {
        console.error("Ocorreu um erro: ", err)
        setNotFound(true)
        setListaMembros([])
      })
      .finally(() => setLoading(false))
  }, [termo, filterSexo])

  const handleRemoverMembro = (id: number) => {
    setListaMembros((prevState) => {
      return [...prevState].filter((dev) => dev.id !== id)
    })
  }

  return (
    <Container maxW="container.xl" padding={{ base: 2, md: 12 }}>
      <Stack
        background="white"
        width="100%"
        rounded={12}
        shadow="dark-lg"
        direction="column"
        mt="10rem"
        mb="10rem"
      >
        <div>
          <Flex paddingX={12} paddingY={8} justifyContent="space-between">
            <Heading>Veja como está nosso time:</Heading>
            <Tooltip label="Filtrar" fontSize="md">
              <Button
                size="lg"
                leftIcon={<AiFillFilter />}
                onClick={onToggle}
                colorScheme="main"
                variant="outline"
              >
                Filtrar
              </Button>
            </Tooltip>
          </Flex>
          <Collapse startingHeight={0} in={isOpen}>
            <Stack spacing={8} paddingX={12} mb={8} direction="row">
              <Input
                onChange={(e) => setTermo(e.target.value)}
                size="lg"
                width="50%"
                placeholder="Digite o id"
              />
              <Select
                value={filterSexo}
                onChange={(event) => setFilterSexo(event.target.value)}
                width="50%"
                placeholder="Filtrar por sexo"
                variant="outline"
                size="lg"
              >
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
                <option value="O">Outros</option>
              </Select>
            </Stack>
          </Collapse>
          <Divider />
        </div>
        {loading && (
          <Center p={12}>
            <CircularProgress isIndeterminate color="main" />
          </Center>
        )}
        {!loading && listaMembros.length === 0 && (
          <NoResultMessage
            title={
              notFound ? "Não foi encontrado nenhum dev" : "Ainda não temos devs em nossa equipe"
            }
            message={
              notFound
                ? "Altere os termos de pesquisa e tente novamente"
                : "Preencha o formulário acima e aumente nossa equipe!"
            }
          />
        )}
        {!loading &&
          listaMembros.map((dev) => {
            return <CardList key={dev.id} developer={dev} onRemoverMembro={handleRemoverMembro} />
          })}
      </Stack>
    </Container>
  )
}

export default SecondSection
