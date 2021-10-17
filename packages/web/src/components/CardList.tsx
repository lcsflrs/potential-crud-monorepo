import { Avatar } from "@chakra-ui/avatar"
import { Button, IconButton } from "@chakra-ui/button"
import { useDisclosure } from "@chakra-ui/hooks"
import Icon from "@chakra-ui/icon"
import { Input } from "@chakra-ui/input"
import { Divider, Flex, Stack, Text } from "@chakra-ui/layout"
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
import { FocusEvent, useEffect, useState } from "react"
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

  const toast = useToast()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  })

  const toggleEdit = () => setIsEditing(!isEditing)

  const handleFocus = (event: FocusEvent<HTMLButtonElement, Element>) => {
    setIsLikePress(true)
    setTimeout(() => setIsLikePress(false), 142)
    event.target.blur()
  }

  const { id, nome, hobby, idade, sexo, dataNascimento } = developer

  const firstName = nome ? nome.split(" ")[0] : ""

  useEffect(() => {
    console.log(developer)
    setValue("dataNascimento", dataNascimento)
    setValue("hobby", hobby)
    setValue("sexo", sexo)
    setValue("nome", nome)
  }, [])

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
    console.log(values)
    const { dataNascimento, hobby, nome, sexo } = values
    console.log(parse(dataNascimento, "dd/MM/yyyy", new Date()))
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
      <Flex paddingX={12} paddingY={8}>
        <Avatar size="2xl" />
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
                    // as={ReactInputMask}
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
              <Flex width="100%" justifyContent={hobby ? "space-between" : "flex-end"}>
                {hobby && (
                  <Text fontSize="lg">{`Adora ${(!!putDev
                    ? putDev.hobby
                    : hobby
                  ).toLowerCase()}`}</Text>
                )}
                <Text fontSize="lg">{`ID: ${id}`}</Text>
              </Flex>
            </Flex>
          )}
          <Flex direction="column" alignItems="flex-end" justifyContent="space-between">
            <Flex direction="row">
              <PopoverTrigger>
                <div>
                  <Tooltip label={`Remover ${firstName}`} fontSize="md">
                    <IconButton
                      aria-label={`Remover ${firstName}`}
                      background="white"
                      icon={<Icon fontSize="2xl" as={AiOutlineDelete} color="red.500" />}
                      mr={4}
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
                    color="#202932"
                  />
                }
                disabled={isEditing}
                onFocus={handleFocus}
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
