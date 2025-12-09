"use client";
import { AppButton, AppInput, AppMainContainer, AppSelect } from "@/themes/components";
import { Formik } from "formik";
import * as Yup from 'yup';
import PatientServices from "@/services/patient";
import { useRouter } from "next/navigation";
import { setFlashData } from "@/helpers/router";
import { useState } from "react";
import moment from "moment";

// ===========================================================================
export default function PatientForm() {

    const router = useRouter();
    const [erro, setErro] = useState<string | null>(null);
    // ===========================================================================
    const handleOnSubmit = async (data: any) => {
        setErro(null);
        const { success, error } = await PatientServices.create(data);
        if (success) {
            setFlashData({ success: 'Paciente cadastrado com sucesso' });
            router.replace('/admin/pacientes');
        } else if (error) {
            setErro(error);
        }
    }
    // ===========================================================================
    return (

        <Formik
            initialValues={{ name: '', gender: 'other', birth_date: moment().format('YYYY-MM-DD') }}
            validationSchema={Yup.object({
                name: Yup.string().required('Campo obrigatório'),
                gender: Yup.string().required('Campo obrigatório'),
                birth_date: Yup.string().required('Campo obrigatório'),
            })}
            onSubmit={handleOnSubmit}
        >
            {({ handleChange, handleSubmit, isSubmitting, isValid, errors, values }) => (
                <form>
                    <AppInput placeholder="Digite seu nome" label="Nome:" name="name" onChange={handleChange} icon="person" error={errors.name} />
                    <AppInput type="date" placeholder="Digite sua data de nascimento" label="Data de nascimento:" name="birth_date" onChange={handleChange} icon="calendar" error={errors.birth_date} />
                    <AppSelect label="Gênero:" onChange={handleChange} name="gender" value={values.gender}>
                        <option value="male">Masculino</option>
                        <option value="female">Feminino</option>
                        <option value="other">Outro</option>
                    </AppSelect>

                    {erro && <p className="my-3 text-[tomato] text-[15px]">{erro}</p>}
                    <AppButton title="Salvar" icon="checkmark" onClick={() => handleSubmit()} disabled={!isValid || isSubmitting} />

                </form>
            )}
        </Formik>

    )
}