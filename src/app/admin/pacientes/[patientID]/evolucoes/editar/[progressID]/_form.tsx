"use client";
import { AppButton, AppInput, AppLoader, AppMainContainer, AppSelect } from "@/themes/components";
import { Formik } from "formik";
import * as Yup from 'yup';
import ProgressServices from "@/services/progress";
import { useRouter } from "next/navigation";
import { setFlashData } from "@/helpers/router";
import { useEffect, useState } from "react";

export interface UserFormProps {
    progressID: number
    patientID: number
}
// ===========================================================================
export default function UserForm({ progressID, patientID }: UserFormProps) {

    const router = useRouter();
    const [progress, setProgress] = useState({ date: '', description: '', patient_id: patientID });
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    // ===========================================================================
    const handleOnSubmit = async (data: any) => {
        setErro(null);
        const { success, error } = await ProgressServices.update(data);
        if (success) {
            setFlashData({ success: 'Evolução editada com sucesso' });
            router.replace(`/admin/pacientes/${patientID}/evolucoes`);
        } else if (error) {
            setErro(error);
        }
    }
    // -----------------------
    useEffect(() => {
        (async () => {
            const { success, progress } = await ProgressServices.getById(patientID, progressID);
            console.log(success, progress);
            if (success) {
                setProgress(progress);
                setLoading(false);
            } else {
                setFlashData({ error: 'Evolução não encontrado' });
                router.replace(`/admin/pacientes/${patientID}/evolucoes`);
            }
        })();
    }, [])
    // ===========================================================================
    return (
        <Formik
            initialValues={progress}
            enableReinitialize
            validationSchema={Yup.object({
                date: Yup.string().required('Campo obrigatório'),
                description: Yup.string().required('Campo obrigatório'),
            })}
            onSubmit={handleOnSubmit}
        >
            {({ handleChange, handleSubmit, isSubmitting, isValid, errors, values }) => (
                <>
                    {loading && <div className="flex justify-center"><AppLoader size={50} className="self-center" /></div>}
                    {!loading &&
                        <form>
                            <AppInput placeholder="Digite sua data" label="Data:" value={values.date} type="date" name="date" onChange={handleChange} icon="calendar" error={errors.date} />
                            <AppInput placeholder="Digite sua descrição" label="Descrição:" value={values.description} name="description" onChange={handleChange} icon="clipboard" error={errors.description} />

                            {erro && <p className="my-3 text-[tomato] text-[15px]">{erro}</p>}
                            <AppButton title="Editar" icon="checkmark" onClick={() => handleSubmit()} disabled={!isValid || isSubmitting} />

                        </form>}
                </>
            )}
        </Formik>

    )
}