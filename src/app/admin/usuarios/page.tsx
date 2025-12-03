import { AppButton, AppMainContainer } from "@/themes/components";
import UserList from "./_list";

export const metadata = {
    title:'Lista de usuários'
}
// ==========================================================
export default function UsersPage() {  

    // ==========================================================
    return (
        <AppMainContainer title="Usuários">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-[20px]">Lista de usuários</h1>

                <AppButton title='Novo usuário' form="round" type="outline" icon="person-add" href="/admin/usuarios/novo" />
            </div>

            <UserList />
        </AppMainContainer>
    )
}