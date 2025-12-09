"use client";
import { AppButton, AppInput } from "@/themes/components";
import { Formik } from "formik";
import * as Yup from 'yup';
import ProgressServices from "@/services/progress";
import { useRouter } from "next/navigation";
import { setFlashData } from "@/helpers/router";
import { useState } from "react";

// ===========================================================================
export default function ProgressForm({ patientID }: { patientID: number }) {

    const router = useRouter();
    const [erro, setErro] = useState<string | null>(null);
    // ===========================================================================
    const handleOnSubmit = async (data: any) => {
        setErro(null);
        const { success, error } = await ProgressServices.create(data);
        if (success) {
            setFlashData({ success: 'Evolução cadastrada com sucesso' });
            router.replace(`/admin/pacientes/${patientID}/evolucoes`);
        } else if (error) {
            setErro(error);
        }
    }
    // ===========================================================================
    return (

        <Formik
            initialValues={{ date: '', description: '', patient_id: patientID }}
            validationSchema={Yup.object({
                date: Yup.string().required('Campo obrigatório'),
                description: Yup.string().required('Campo obrigatório'),
            })}
            onSubmit={handleOnSubmit}
        >
            {({ handleChange, handleSubmit, isSubmitting, isValid, errors, values }) => (
                <form>
                    <AppInput placeholder="Digite sua data" label="Data:" type="date" name="date" onChange={handleChange} icon="calendar" error={errors.date} />
                    <AppInput placeholder="Digite sua descrição" label="Descrição:" name="description" onChange={handleChange} icon="clipboard" error={errors.description} />

                    {erro && <p className="my-3 text-[tomato] text-[15px]">{erro}</p>}
                    <AppButton title="Salvar" icon="checkmark" onClick={() => handleSubmit()} disabled={!isValid || isSubmitting} />

                </form>
            )}
        </Formik>

    )
}
