"use client";
import { AppButton, AppInput, AppLoader, AppMainContainer, AppSelect } from "@/themes/components";
import { Formik } from "formik";
import * as Yup from 'yup';
import PatientServices from "@/services/patient";
import { useRouter } from "next/navigation";
import { setFlashData } from "@/helpers/router";
import { useEffect, useState } from "react";

export interface UserFormProps {
    patientID: number
}
// ===========================================================================
export default function UserForm({ patientID }: UserFormProps) {

    const router = useRouter();
    const [patient, setPatient] = useState({ name: '', gender: '', birth_date: '' });
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    // ===========================================================================
    const handleOnSubmit = async (data: any) => {
        setErro(null);
        const { success, error } = await PatientServices.update(data);
        if (success) {
            setFlashData({ success: 'Paciente editado com sucesso' });
            router.replace('/admin/pacientes');
        } else if (error) {
            setErro(error);
        }
    }
    // -----------------------
    useEffect(() => {
        (async () => {
            const { success, patient } = await PatientServices.getById(patientID);
            console.log(success, patient);
            if (success) {
                setPatient(patient);
                setLoading(false);
            } else {
                setFlashData({ error: 'Paciente não encontrado' });
                router.replace('/admin/pacientes');
            }
        })();
    }, [])
    // ===========================================================================
    return (
        <Formik
            initialValues={patient}
            enableReinitialize
            validationSchema={Yup.object({
                name: Yup.string().required('Campo obrigatório'),
                gender: Yup.string().required('Campo obrigatório'),
                birth_date: Yup.string().required('Campo obrigatório'),
            })}
            onSubmit={handleOnSubmit}
        >
            {({ handleChange, handleSubmit, isSubmitting, isValid, errors, values }) => (
                <>
                    {loading && <div className="flex justify-center"><AppLoader size={50} className="self-center" /></div>}
                    {!loading &&
                        <form>
                            <AppInput placeholder="Digite seu nome" label="Nome:" name="name" onChange={handleChange} icon="person" error={errors.name} value={values.name} />
                            <AppInput type="date" placeholder="Digite sua data de nascimento" label="Data de nascimento:" name="birth_date" onChange={handleChange} icon="calendar" error={errors.birth_date} value={values.birth_date} />
                            <AppSelect label="Gênero:" onChange={handleChange} name="gender" value={values.gender}>
                                <option value="male">Masculino</option>
                                <option value="female">Feminino</option>
                                <option value="other">Outro</option>
                            </AppSelect>
                            {erro && <p className="my-3 text-[tomato] text-[15px]">{erro}</p>}
                            <AppButton title="Editar" icon="checkmark" onClick={() => handleSubmit()} disabled={!isValid || isSubmitting} />

                        </form>}
                </>
            )}
        </Formik>

    )
}
