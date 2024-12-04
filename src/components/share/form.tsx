import { createEffect, createMemo, createSignal } from "solid-js"
import { z, ZodError } from "zod"


interface FormOptions<T extends z.ZodObject<any>> {
  /**
 * Change this value to reset the form error
 */
  resetKey?: any,
  schema: T,
  preProcess?: (formData: Record<string, any>) => Record<string, any>
}
export const createForm = <T extends z.ZodObject<any>>(options: () => FormOptions<T>) => {

  const [formError, setFormError] = createSignal<ZodError>()
  const formErrorMap = createMemo(() => new Map(formError()?.errors.map((e) => [e.path[0], e])))

  const submitHandlerBuilder = (f: (data: z.infer<T>) => void) => {
    return (e: Event) => {
      e.preventDefault()
      const target = e.target as HTMLFormElement
      const formData = new FormData(target)
      const formatedData = Object.fromEntries(formData.entries())
      const preProcess = options().preProcess;
      const processedData = preProcess
        ? preProcess(formatedData)
        : formatedData

      try {
        const data = options().schema.parse(processedData)
        f(data)
        setFormError(undefined)
      } catch (error) {
        if (error instanceof ZodError) {
          setFormError(error)
        }
      }
    }
  }

  createEffect(() => {
    if (options().resetKey) {
      setFormError(undefined)
    }
  })

  return {
    formErrorMap,
    formError,
    submitHandlerBuilder
  }
}