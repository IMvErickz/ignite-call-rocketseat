import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import handle from "../../../../api/users/profile.api";
import { ConfirmForm, FormActions, FormError, FormHeader } from "./styles";
import { CalendarBlank, Clock } from "phosphor-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { api } from "../../../../../lib/axios";
import { useRouter } from "next/router";

const confirmFormSchema = z.object({
    name: z.string().min(3, { message: 'O nome precisa no mínimo três caractéres' }),
    email: z.string().email({ message: 'Digite um email válido' }),
    observations: z.string().nullable()
})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

interface ConfirmStepProps {
    schedulingDate: Date
    onCancelConfirmation: () => void
}

export function ConfirmStep({ schedulingDate, onCancelConfirmation }: ConfirmStepProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ConfirmFormData>({
        resolver: zodResolver(confirmFormSchema)
    })

    const router = useRouter()

    const username = String(router.query.username)

    async function handleConfirmScheduling(data: ConfirmFormData) {
        const { email, name, observations } = data
        await api.post(`/users/${username}/schedule`, {
            name,
            email,
            observations,
            date: schedulingDate
        })

        onCancelConfirmation()
    }

    const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
    const describedTime = dayjs(schedulingDate).format('HH:mm[h]')

    return (
        <ConfirmForm as='form' onSubmit={handleSubmit(handleConfirmScheduling)}>
            <FormHeader>
                <Text>
                    <CalendarBlank />
                    {describedDate}
                </Text>
                <Text>
                    <Clock />
                    {describedTime}
                </Text>
            </FormHeader>

            <label>
                <Text size='sm'>Nome completo</Text>
                <TextInput placeholder="Seu nome" crossOrigin {...register('name')} />
                {errors.name && (
                    <FormError size='sm'>
                        {errors.name.message}
                    </FormError>
                )}
            </label>

            <label>
                <Text size='sm'>Endereço de email</Text>
                <TextInput type="email" placeholder="Johndoe@example.com" crossOrigin {...register('email')} />
                {errors.email && (
                    <FormError size='sm'>
                        {errors.email.message}
                    </FormError>
                )}
            </label>

            <label>
                <Text size='sm'>Observações</Text>
                <TextArea {...register('observations')} />
            </label>

            <FormActions>
                <Button type="button" variant='tertiary' onClick={onCancelConfirmation}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>Confirmar</Button>
            </FormActions>
        </ConfirmForm>
    )
}