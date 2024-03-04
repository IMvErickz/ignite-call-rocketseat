import { Heading, Text, MultiStep, TextInput, Button } from "@ignite-ui/react";
import { Container, Form, FormError, Header } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "../../lib/axios";
import { AxiosError } from "axios";
import { NextSeo } from "next-seo";

const registerFormSchema = z.object({
    username: z.string()
        .min(3, { message: 'No mínimo três caractéres' })
        .regex(/^([a-z\\-]+)$/i, { message: 'Somente letras e hífens' })
        .transform(username => username.toLocaleLowerCase()),
    name: z.string().min(3, { message: 'No mínimo três caractéres' })
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            username: 'JohnDoe'
        }
    })

    const router = useRouter()

    useEffect(() => {
        if (router.query?.username) {
            setValue('username', String(router.query?.username))
        }
    }, [router.query?.username, setValue])

    async function handleRegister(data: RegisterFormData) {
        const { username, name } = data

        try {
            await api.post('/users', {
                username,
                name
            })

            await router.push('/register/connect-calendar')
        } catch (err) {
            if (err instanceof AxiosError && err?.response?.data?.message) {
                alert(err?.response?.data?.message)
                return
            }

            console.error(err)
        }
    }

    return (
        <>
            <NextSeo
                title='Cria uma conta | Ignite-call'
            />

            <Container>
                <Header>
                    <Heading as='strong'>
                        Bem-vindo ao Ignite Call
                    </Heading>
                    <Text>
                        Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.
                    </Text>

                    <MultiStep size={4} currentStep={1} />
                </Header>

                <Form as='form' onSubmit={handleSubmit(handleRegister)}>
                    <label>
                        <Text size='sm'>Nome de usuário</Text>
                        <TextInput prefix="ignite.com/" placeholder="Seu usuário" crossOrigin={undefined} {...register('username')} />
                        {errors.username && (<FormError size={'sm'}>{errors.username.message}</FormError>)}
                    </label>

                    <label>
                        <Text size='sm'>Nome completo</Text>
                        <TextInput placeholder="Seu nome" crossOrigin={undefined} {...register('name')} />
                        {errors.name && (<FormError size={'sm'}>{errors.name.message}</FormError>)}
                    </label>

                    <Button type="submit" disabled={isSubmitting}>
                        Próximo passo
                        <ArrowRight />
                    </Button>
                </Form>
            </Container>
        </>
    )
}