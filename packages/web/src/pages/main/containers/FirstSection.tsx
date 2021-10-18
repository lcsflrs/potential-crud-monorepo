import { Button } from "@chakra-ui/button"
import { Input } from "@chakra-ui/input"
import { Badge, Container, Flex, Heading, Stack, Text } from "@chakra-ui/layout"
import { Select } from "@chakra-ui/select"
import { useToast } from "@chakra-ui/toast"
import { yupResolver } from "@hookform/resolvers/yup"
import { differenceInYears, isBefore, isValid, parse } from "date-fns"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import ReactInputMask from "react-input-mask"
import * as yup from "yup"
import api from "../../../api"
import { Developer, FormValues } from "../types"

interface Props {
  setListaMembros: Dispatch<SetStateAction<Developer[]>>
  termo: string
}

const schema = yup.object({
  nome: yup.string().required("Campo obrigatório!"),
  sexo: yup.string().required("Campo obrigatório!"),
  dataNascimento: yup
    .string()
    .required("Campo obrigatório!")
    .test("data-valida", "Data inválida!", (value) => {
      if (!value) {
        return false
      }
      let date = parse(value, "dd/MM/yyyy", new Date())
      if (!isValid(date)) {
        return false
      }
      const hoje = new Date()
      return isBefore(date, hoje)
    }),
  hobby: yup.string(),
})

const FirstSection = ({ setListaMembros, termo }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  })
  const toast = useToast()

  const onSubmit = handleSubmit((values) => {
    const { dataNascimento, hobby, nome, sexo } = values
    const firstName = nome ? nome.split(" ")[0] : ""
    api
      .post("/", {
        nome,
        sexo,
        dataNascimento,
        hobby,
        idade: differenceInYears(new Date(), parse(dataNascimento, "dd/MM/yyyy", new Date())),
      })
      .then((response) => {
        if (!termo) {
          setListaMembros((prevState) => {
            return [...prevState, response.data as Developer]
          })
        }
        reset()
        setValue("dataNascimento", "")
        toast({
          title: "Dev adicionado!",
          description: `${firstName} foi adicionado à nossa equipe`,
          status: "success",
          duration: 4000,
          isClosable: true,
        })
      })
      .catch((err) => console.error("Ocorreu um erro: ", err))
  })

  return (
    <Container maxW="container.xl" padding={{ base: 0, md: 12 }}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        {/* Parte */}
        <Flex
          padding={{ base: 12, md: 0 }}
          justifyContent="center"
          alignItems="flex-start"
          direction="column"
        >
          <Heading mb={2} color="#202932">
            Uma boa equipe é fundamental <br />
            para o desenvolvimento de qualquer projeto
          </Heading>
          <Text fontSize="lg" mb={6}>
            Preencha os campos ao lado para aumentar nossa equipe.
          </Text>
        </Flex>
        {/* Parte */}
        <Flex
          justifyContent={{ base: "center", md: "flex-end" }}
          // background="blue"
          alignItems="center"
          marginLeft={{ base: 0, md: 12 }}
        >
          <form onSubmit={onSubmit}>
            <Flex
              background="white"
              width={{ base: "22rem", md: "24rem" }}
              rounded={12}
              shadow="dark-lg"
              direction="column"
            >
              <Stack spacing={4} width="100%" padding={8}>
                <Flex direction="column" width="100%">
                  <Text mb={2} display="inline">
                    Nome:{" "}
                    {errors.nome && (
                      <Text display="inline" mt={2} color="red">
                        • Campo obrigatório!
                      </Text>
                    )}
                  </Text>

                  <Input
                    {...register("nome")}
                    placeholder="Ex: Lucas Flores"
                    variant="filled"
                    width="100%"
                    errorBorderColor="red"
                  />
                </Flex>
                <Flex direction="column" width="100%">
                  <Text mb={2}>
                    Data de Nascimento:{" "}
                    {errors.dataNascimento && (
                      <Text display="inline" mt={2} color="red">
                        • {errors.dataNascimento.message}
                      </Text>
                    )}
                  </Text>
                  <Input
                    {...register("dataNascimento")}
                    as={ReactInputMask}
                    mask="99/99/9999"
                    placeholder="dd/mm/aaaa"
                    variant="filled"
                  />
                </Flex>
                <Flex direction="column" width="100%">
                  <Text mb={2}>Sexo:</Text>
                  <Select {...register("sexo")} variant="filled">
                    <option value="F">Feminino</option>
                    <option value="M">Masculino</option>
                    <option value="O">Outros</option>
                  </Select>
                </Flex>
                <Flex direction="column" width="100%">
                  <Flex mb={2} justifyContent="space-between">
                    <Text>Hobby:</Text>
                    <Badge variant="outline" colorScheme="#C2DDEC">
                      Opcional
                    </Badge>
                  </Flex>
                  <Input
                    {...register("hobby")}
                    placeholder="Ex: Jogar videogame"
                    variant="filled"
                  />
                </Flex>
              </Stack>
              <Button
                colorScheme="main"
                borderTopLeftRadius={0}
                borderTopRightRadius={0}
                padding={6}
                type="submit"
              >
                Aumentar a Equipe
              </Button>
            </Flex>
          </form>
        </Flex>
      </Flex>
    </Container>
  )
}

export default FirstSection
