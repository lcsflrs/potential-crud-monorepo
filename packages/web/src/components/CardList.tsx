import { Avatar } from "@chakra-ui/avatar"
import { Button, IconButton } from "@chakra-ui/button"
import { useDisclosure } from "@chakra-ui/hooks"
import Icon from "@chakra-ui/icon"
import { Input } from "@chakra-ui/input"
import { Divider, Flex, Stack, Text } from "@chakra-ui/layout"
import { useMediaQuery } from "@chakra-ui/media-query"
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/popover"
import { Select } from "@chakra-ui/select"
import { useToast } from "@chakra-ui/toast"
import { Tooltip } from "@chakra-ui/tooltip"
import { yupResolver } from "@hookform/resolvers/yup"
import { differenceInYears, parse } from "date-fns"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { AiFillHeart, AiOutlineDelete, AiOutlineEdit, AiOutlineHeart } from "react-icons/ai"
import * as yup from "yup"
import api from "../api"
import { Developer, FormValues } from "../pages/main/types"

interface Props {
  developer: Developer
  onRemoverMembro: (id: number) => void
}

const schema = yup.object({
  nome: yup.string().required(),
  sexo: yup.string().required(),
  dataNascimento: yup.string().required(),
  hobby: yup.string(),
})

const CardList = ({ developer, onRemoverMembro }: Props) => {
  const [isLikePress, setIsLikePress] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { onOpen, onClose, isOpen } = useDisclosure()
  const [putDev, setPutDev] = useState<Developer | undefined>()
  const [isSmallerThanMD] = useMediaQuery("(max-width: 48em)")
  const toast = useToast()

  const { id, nome, hobby, idade, sexo, dataNascimento } = developer

  const firstName = nome ? nome.split(" ")[0] : ""

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    setValue("dataNascimento", dataNascimento)
    setValue("hobby", hobby)
    setValue("sexo", sexo)
    setValue("nome", nome)
  }, [])

  useEffect(() => {
    if (!!putDev) {
      setValue("dataNascimento", dataNascimento)
      setValue("hobby", putDev.hobby)
      setValue("sexo", putDev.sexo)
      setValue("nome", putDev.nome)
    }
  }, [putDev])

  const toggleEdit = () => setIsEditing(!isEditing)

  const handleLike = () => {
    setIsLikePress(true)
    toast({
      title: `Você incentivou ${firstName}!`,
      description: `${sexo === "F" ? "Ela" : "Ele"} agradece por isso!`,
      status: "success",
      duration: 4000,
      isClosable: true,
    })
  }

  const removerMembro = (id: number) => {
    api.delete(`/${id}`)
    onRemoverMembro(id)
    toast({
      title: "Dev removido :(",
      description: `${firstName} foi removido de nossa equipe`,
      status: "success",
      duration: 4000,
      isClosable: true,
    })
  }

  const onSubmit = handleSubmit((values) => {
    const { dataNascimento, hobby, nome, sexo } = values
    api
      .put(`/${id}`, {
        nome,
        sexo,
        dataNascimento,
        hobby,
        idade: differenceInYears(new Date(), parse(dataNascimento, "dd/MM/yyyy", new Date())),
      })
      .then((response) => {
        setPutDev(response.data as Developer)
        setIsEditing(false)
        toast({
          title: "Dev atualizado!",
          description: `${firstName} teve seus dados atualizados`,
          status: "success",
          duration: 4000,
          isClosable: true,
        })
      })
      .catch((err) => console.error("Ocorreu um erro: ", err))
  })

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <Flex paddingX={{ base: 0, md: 12 }} paddingY={8}>
        {!isSmallerThanMD && <Avatar size="2xl" />}
        <Flex justifyContent={isEditing ? "flex-end" : "space-between"} width="100%">
          {isEditing ? (
            <form onSubmit={onSubmit}>
              <Stack spacing={4} direction="column" paddingX={12} justifyContent="space-between">
                <Input
                  {...register("nome")}
                  placeholder="Nome"
                  variant="filled"
                  width="100%"
                  autoFocus
                />
                <Stack spacing={4} direction="row">
                  <Input
                    mask="99/99/9999"
                    placeholder="Data de Nascimento"
                    variant="filled"
                    {...register("dataNascimento")}
                    disabled
                  />
                  <Select {...register("sexo")} variant="filled">
                    <option value="F">Feminino</option>
                    <option value="M">Masculino</option>
                    <option value="O">Outros</option>
                  </Select>
                </Stack>
                <Input {...register("hobby")} placeholder="Hobby" variant="filled" />
                <Flex justifyContent="flex-end">
                  <Button colorScheme="green" type="submit">
                    Salvar
                  </Button>
                </Flex>
              </Stack>
            </form>
          ) : (
            <Flex width="100%" direction="column" paddingX={12} justifyContent="space-between">
              <Flex direction="column">
                <Text fontSize="2xl">{!!putDev ? putDev.nome : nome}</Text>
                <Text fontSize="lg">{`${idade} anos`}</Text>
              </Flex>
              <Flex
                width="100%"
                justifyContent={
                  hobby || (!!putDev && !!putDev.hobby) ? "space-between" : "flex-end"
                }
              >
                {hobby ||
                  (!!putDev && !!putDev.hobby && (
                    <Text fontSize="lg">{`Adora ${(!!putDev
                      ? putDev.hobby
                      : hobby
                    ).toLowerCase()}`}</Text>
                  ))}
                <Text fontSize="lg">{`ID: ${id}`}</Text>
              </Flex>
            </Flex>
          )}
          <Flex
            direction="column"
            alignItems="flex-end"
            justifyContent="space-between"
            mr={{ base: 8, md: 0 }}
          >
            <Flex direction={isSmallerThanMD ? "column" : "row"} alignItems="flex-end">
              <PopoverTrigger>
                <div>
                  <Tooltip label={`Remover ${firstName}`} fontSize="md">
                    <IconButton
                      aria-label={`Remover ${firstName}`}
                      background="white"
                      icon={<Icon fontSize="2xl" as={AiOutlineDelete} color="red.500" />}
                      mr={{ base: 0, md: 4 }}
                      disabled={isEditing}
                      onClick={onOpen}
                    />
                  </Tooltip>
                </div>
              </PopoverTrigger>
              <Tooltip label="Editar dados" fontSize="md">
                <IconButton
                  aria-label="Editar Dados"
                  background="white"
                  icon={<Icon fontSize="2xl" as={AiOutlineEdit} color="202932" />}
                  onClick={toggleEdit}
                />
              </Tooltip>
            </Flex>

            <Tooltip label={`Incentivar ${firstName}`} fontSize="md">
              <IconButton
                aria-label={`Incentivar ${firstName}`}
                background="white"
                icon={
                  <Icon
                    fontSize="2xl"
                    as={isLikePress ? AiFillHeart : AiOutlineHeart}
                    color={isLikePress ? "red.500" : "main"}
                  />
                }
                onClick={handleLike}
                disabled={isEditing}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
      <Divider />
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Atenção!</PopoverHeader>
        <PopoverBody mt={2}>{`Tem certeza que deseja remover ${firstName} do time?`}</PopoverBody>
        <Flex justifyContent="flex-end" padding={2}>
          <Button variant="outline" colorScheme="red" mr={2} onClick={() => removerMembro(id)}>
            Remover⠀:(
          </Button>
          <Button variant="solid" colorScheme="red" onClick={onClose}>
            Voltar
          </Button>
        </Flex>
      </PopoverContent>
    </Popover>
  )
}

export default CardList
