import { AppMainContainer } from "@/themes/components";
import UsuarioForm from "./_form";

export const metadata = {
    title: 'Editar usuário'
}

// ===========================================================================
export default async function UsuariosEditarPage({params}: any) {

    const { usuarioID } = await params;
    
    // ===========================================================================
    return (
        <AppMainContainer title="Editar usuário">
            <UsuarioForm usuarioID={usuarioID}/>
        </AppMainContainer>
    )
}