import { AppMainContainer } from "@/themes/components";
import UserForm from "./_form";

export const metadata = {
    title: 'Cadastrar usuário'
}

// ===========================================================================
export default function UsersNovoPage() {

    // ===========================================================================
    return (
        <AppMainContainer title="Novo usuário">
            <UserForm/>
        </AppMainContainer>
    )
}