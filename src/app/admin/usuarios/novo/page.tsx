import { AppMainContainer } from "@/themes/components";
import UsuarioForm from "./_form";

export const metadata = {
    title: 'Cadastrar usuário'
}

// ===========================================================================
export default function UsuariosNovoPage() {

    // ===========================================================================
    return (
        <AppMainContainer title="Novo usuário">
            <UsuarioForm/>
        </AppMainContainer>
    )
}