import { Dispatch, SetStateAction, useState } from "react"
import { DEFAULT_DEBOUNCE_TIMEOUT } from "../utils/constants"
import useDebounce from "./useDebounce"
/**
 * Este hook é um useState que utiliza o hook useDebounce por padrão
 * @param value valor inicial (igual o useState)
 * @param delay tempo em ms para atualização
 */
function useDebouncedState<T>(
  value: T,
  delay: number = DEFAULT_DEBOUNCE_TIMEOUT,
): [T, Dispatch<SetStateAction<T>>] {
  const [_value, setValue] = useState(value)

  const debouncedValue = useDebounce(_value, delay)

  return [debouncedValue, setValue]
}

export default useDebouncedState
