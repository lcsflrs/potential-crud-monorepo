import { useEffect, useState } from "react"
import { DEFAULT_DEBOUNCE_TIMEOUT } from "../utils/constants"

/**
 * Hook para debounce. Ao alterar o valor, a alteração persistirá após `delay` milissegundos.
 * @param value valor que será atualizado
 * @param delay tempo em ms para atualização
 */
function useDebounce<T>(value: T, delay: number = DEFAULT_DEBOUNCE_TIMEOUT) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
