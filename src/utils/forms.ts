import * as Yup from 'yup'


export function oneOfEnum<T>(enumObject: { [s: string]: T } | ArrayLike<T>) {
  return Yup.mixed<T>().oneOf(Object.values(enumObject))
}
