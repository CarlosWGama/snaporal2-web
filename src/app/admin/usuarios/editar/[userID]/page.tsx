import { AppMainContainer } from "@/themes/components";
import UserForm from "./_form";

export const metadata = {
    title: 'Editar usuário'
}

// ===========================================================================
export default async function UsersEditarPage({params}: any) {

    const { userID } = await params;
    
    // ===========================================================================
    return (
        <AppMainContainer title="Editar usuário">
            <UserForm userID={userID}/>
        </AppMainContainer>
    )
}