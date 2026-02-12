import z from "zod"

export const registerSchmeValidate=z.object({
    email:z.string().email(),
    username:z.string().min(6),
    password:z.string().min(6,"Password must be at least 6 characters")
})