const LOOSE_STRIP_REGEX = /[^\d]/g

export const removerCaracteres = (st: string) => {
  const regex = LOOSE_STRIP_REGEX
  return (st || "").toString().replace(regex, "")
}
