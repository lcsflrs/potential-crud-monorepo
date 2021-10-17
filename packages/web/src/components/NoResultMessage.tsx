import { Center, Text } from "@chakra-ui/layout"

interface Props {
  title: string
  message?: string
}

const NoResultMessage = ({ title, message }: Props) => {
  return (
    <Center flexDirection="column" padding={12}>
      <Text fontSize="2xl">{title}</Text>
      <Text>{message}</Text>
    </Center>
  )
}

export default NoResultMessage
