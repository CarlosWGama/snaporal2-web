"use client";
import { AppButton, AppInput, AppMainContainer, AppSelect } from "@/themes/components";
import { Formik } from "formik";
import * as Yup from 'yup';
import UserServices from "@/services/usuario";
import { useRouter } from "next/navigation";
import { setFlashData } from "@/helpers/router";
import { useState } from "react";

// ===========================================================================
export default function UsuarioForm() {

    const router = useRouter();
    const [ erro, setErro ] = useState<string|null>(null);
    // ===========================================================================
    const handleOnSubmit = async (data:any) => {
        setErro(null);
        const { success, error } =  await UserServices.create(data);
        if (success) {
            setFlashData({success: 'Usuário cadastrado com sucesso'});
            router.replace('/admin/usuarios');
        } else if (error) {
            setErro(error);
        }
    }
    // ===========================================================================
    return ( 
    
        <Formik
        initialValues={{nome: '', email: '', password: '', admin: false, nivel_id: 1}}
        validationSchema={Yup.object({
            nome: Yup.string().required('Campo obrigatório'),
            email: Yup.string().required('Campo obrigatório').email('Campo precisa ser um email'),
            password: Yup.string().required('Campo obrigatório').min(6, 'Campo precisa ter pelo menos 6 caracteres')
        })}
            onSubmit={handleOnSubmit}
            >
            {({handleChange, handleSubmit, isSubmitting, isValid, errors}) => (
                <form>
                        <AppInput placeholder="Digite seu nome" label="Nome:" name="nome" onChange={handleChange} icon="person" error={errors.nome} />
                        <AppInput placeholder="Digite seu email" label="Email:" name="email" onChange={handleChange} icon="email" error={errors.email} />
                        <AppInput placeholder="Digite sua senha" label="Senha:" name="password" type="password" onChange={handleChange} icon="locked" openPassword  error={errors.password}/>
                        <AppSelect label="Nível:" onChange={handleChange} name="admin">
                            <option value="1">Administrador</option>
                            <option value="0">Usuário</option>
                        </AppSelect>
                        <AppSelect label="Tipo usuário:" onChange={handleChange} name="nivel_id">
                            <option value="1">Especialista</option>
                            <option value="2">Profissional</option>
                        </AppSelect>

                        {erro && <p className="my-3 text-[tomato] text-[15px]">{erro}</p>}
                        <AppButton title="Salvar" icon="checkmark" onClick={() => handleSubmit()} disabled={!isValid || isSubmitting}/>

                </form>
            )}
        </Formik>
        
    )
}