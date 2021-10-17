import { Button } from "@chakra-ui/button"
import { useDisclosure } from "@chakra-ui/hooks"
import { Input } from "@chakra-ui/input"
import { Center, Divider, Flex, Stack } from "@chakra-ui/layout"
import { CircularProgress } from "@chakra-ui/progress"
import { Heading } from "@chakra-ui/react"
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

  useEffect(() => {
    setLoading(true)
    const arrayAuxiliar: Developer[] = [] // Utilizado para auxiliar o manejo do `data` que vem da requisição
    api
      .get(`/${termo}`)
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
      //.then((response) => console.log(response))
      .catch((err) => {
        console.error("Ocorreu um erro: ", err)
        setNotFound(true)
        setListaMembros([])
      })
      .finally(() => setLoading(false))
  }, [termo])

  useEffect(() => {
    console.log(listaMembros)
  }, [listaMembros])

  const handleRemoverMembro = (id: number) => {
    setListaMembros((prevState) => {
      return [...prevState].filter((dev) => dev.id !== id)
    })
  }

  return (
    <Stack
      background="white"
      width="60%"
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
          <Flex paddingX={12} mb={8}>
            <Input
              onChange={(e) => setTermo(e.target.value)}
              size="lg"
              width="50%"
              placeholder="Digite o id"
            />
          </Flex>
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
  )
}

export default SecondSection
