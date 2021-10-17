import { Button } from "@chakra-ui/button"
import { Input } from "@chakra-ui/input"
import { Badge, Flex, Grid, GridItem, Heading, Stack, Text } from "@chakra-ui/layout"
import { Select } from "@chakra-ui/select"
import { useToast } from "@chakra-ui/toast"
import { yupResolver } from "@hookform/resolvers/yup"
import { differenceInYears, parse } from "date-fns"
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
  dataNascimento: yup.string().required("Campo obrigatório!"),
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
    console.log(values)
    const { dataNascimento, hobby, nome, sexo } = values
    const firstName = nome ? nome.split(" ")[0] : ""
    console.log(parse(dataNascimento, "dd/MM/yyyy", new Date()))
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
    <Grid
      mt="10rem"
      templateColumns="60% 40%"
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      {/* Parte */}
      <GridItem>
        <Flex justifyContent="center" alignItems="flex-start" direction="column">
          <Heading mb={2} color="#202932">
            Uma boa equipe é fundamental <br />
            para o desenvolvimento de qualquer projeto
          </Heading>
          <Text fontSize="lg" mb={6}>
            Preencha os campos ao lado para aumentar nossa equipe.
          </Text>
        </Flex>
      </GridItem>
      {/* Parte */}
      <GridItem>
        <Flex
          justifyContent="center"
          // background="blue"
          alignItems="center"
          marginLeft={12}
        >
          <form onSubmit={onSubmit}>
            <Flex background="white" width="24rem" rounded={12} shadow="dark-lg" direction="column">
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
      </GridItem>
    </Grid>
  )
}

export default FirstSection
