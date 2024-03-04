import { Button, TextInput, Text } from "@ignite-ui/react";
import { Form, FormAnnotation } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from "next/router";

const claimUsernameFormSchema = z.object({
    username: z.string()
        .min(3, { message: 'No mínimo três caractéres' })
        .regex(/^([a-z\\-]+)$/i, { message: 'Somente letras e hífens' })
        .transform(username => username.toLocaleLowerCase())
})

type ClaimUsernameFormType = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {

    const { register, handleSubmit, formState: { errors } } = useForm<ClaimUsernameFormType>({
        resolver: zodResolver(claimUsernameFormSchema)
    })

    const router = useRouter()

    async function handleClaimUsername(data: ClaimUsernameFormType) {

        const { username } = data

        await router.push(`/register?username=${username}`)
    }

    return (
        <>
            <Form as='form' onSubmit={handleSubmit(handleClaimUsername)}>
                <TextInput size='sm' prefix="ignite.com/" placeholder="Seu usuário" crossOrigin={undefined} {...register('username')} />
                <Button>
                    Reservar
                    <ArrowRight />
                </Button>


            </Form>

            <FormAnnotation>
                <Text>
                    {errors.username ? errors.username.message : 'Digite o nome do usuário'}
                </Text>
            </FormAnnotation>
        </>
    )
}