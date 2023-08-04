import {z} from 'zod'

const messageValidator= z.object({
    id: z.string(),
    content:z.string().max(500),
    isUser: z.boolean()
})

export const messageArrayValidator= z.array(messageValidator);

export default messageValidator;
export type Message= z.infer<typeof messageValidator>