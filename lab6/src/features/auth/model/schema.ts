import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { passwordRule, requiredText } from '@/shared/lib'

export const loginSchema = z.object({
  username: requiredText(),
  password: passwordRule(),
})

export const loginFormSchema = toTypedSchema(loginSchema)
