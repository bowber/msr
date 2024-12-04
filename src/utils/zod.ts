import dayjs from 'dayjs'
import { z } from 'zod'

export const dateFromArraySchema = z.number().transform((v) => dayjs(v * 1000))

export const stringToNumberSchema = z.string().transform((v) => {
  const num = Number(v)
  if (isNaN(num)) {
    throw new Error('Invalid number')
  }
  return num
})

export const emptyStrToUndefinedSchema = z.string().transform((v) => {
  if (v === '') return undefined
  return v
})
