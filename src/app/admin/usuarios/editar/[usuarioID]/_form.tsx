"use client";
import { AppButton, AppInput, AppMainContainer, AppSelect } from "@/themes/components";
import { Formik } from "formik";
import * as Yup from 'yup';
import UsuarioServices from "@/services/usuario";
import { useRouter } from "next/navigation";
import { setFlashData } from "@/helpers/router";
import { useEffect, useState } from "react";

export interface UsuarioFormProps {
    usuarioID: number
}
// ===========================================================================
export default function UsuarioForm({ usuarioID }: UsuarioFormProps) {

    const router = useRouter();
    const [ usuario, setUsuario ] = useState({nome: '', email: '', password: '', admin: false, nivel_id: 1});
    const [ erro, setErro ] = useState<string|null>(null);
    // ===========================================================================
    const handleOnSubmit = async (data:any) => {
        setErro(null);
        const { success, error } =  await UsuarioServices.update(data);
        if (success) {
            setFlashData({success: 'Usuário editado com sucesso'});
            router.replace('/admin/usuarios');
        } else if (error) {
            setErro(error);
        }
    }
    // -----------------------
    useEffect(() => {
        (async() => {
            const { success, usuario } = await UsuarioServices.getById(usuarioID);
            if (success) setUsuario(usuario);
            else {
                setFlashData({error: 'Usuário não encontrado'});
                router.replace('/admin/usuarios');
            }
        })();
    }, [])
    // ===========================================================================
    return (    
        <Formik
            initialValues={usuario}
            enableReinitialize
            validationSchema={Yup.object({
                nome: Yup.string().required('Campo obrigatório'),
                email: Yup.string().required('Campo obrigatório').email('Campo precisa ser um email'),
                password: Yup.string().min(6, 'Campo precisa ter pelo menos 6 caracteres')
            })}
            onSubmit={handleOnSubmit}
            >
            {({handleChange, handleSubmit, isSubmitting, isValid, errors, values}) => (
                <form>
                        <AppInput placeholder="Digite seu nome" label="Nome:" name="nome" onChange={handleChange} icon="person" error={errors.nome} value={values.nome} />
                        <AppInput placeholder="Digite seu email" label="Email:" name="email" onChange={handleChange} icon="email" error={errors.email} value={values.email} />
                        <AppInput placeholder="Digite sua senha" label="Senha:" name="password" type="password" onChange={handleChange} icon="locked" openPassword  error={errors.password} />
                        <AppSelect label="Administrador:" onChange={handleChange} name="admin" value={values.admin ? '1' : '0'}>
                            <option value="1">Administrador</option>
                            <option value="0">Usuário</option>
                        </AppSelect>
                        <AppSelect label="Tipo usuário:" onChange={handleChange} name="nivel_id" value={String(values.nivel_id)}>
                            <option value="1">Especialista</option>
                            <option value="2">Profissional</option>
                        </AppSelect>

                        {erro && <p className="my-3 text-[tomato] text-[15px]">{erro}</p>}
                        <AppButton title="Editar" icon="checkmark" onClick={() => handleSubmit()} disabled={!isValid || isSubmitting}/>

                </form>
            )}
        </Formik>
        
    )
}