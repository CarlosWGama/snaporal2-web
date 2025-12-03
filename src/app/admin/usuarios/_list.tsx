"use client";
import { useEffect, useState } from "react"
import Link from "next/link";
import { AppButton, AppLoader, AppModal } from "@/themes/components";
import { getFlashData } from "@/helpers/router";
import { getRoleDescription } from "@/helpers/user";
import UserServices from "@/services/user";

export default function UserList() {

    const [ users, setUsers ] = useState<any[]>([]);
    const [ userRemove, setUserRemove ] = useState<any>(null);
    const [ success, setSuccess ] = useState<string|null>(null);
    const [ error, setError ] = useState<string|null>(null);
    const [ loading, setLoading ] = useState(true);
    
    // ======================================================================
    const getUsers = async () => {
        const { success , users } = await UserServices.getAll();
        if (success && users) setUsers(users);
        setLoading(false);
    }
    // -----------
    const handleRemove = async (user: any) => {
        setUserRemove(user);
        setSuccess(null);
        setError(null);
    }
    // -----------
    const handleModalConfirm = async () => {
        setUserRemove(null);
        setLoading(true);
        await UserServices.delete(userRemove.id);
        await getUsers();
        setSuccess('Usuário excluido com sucesso!');
    }
    // -----------
    const handleModalCancel = async () => {
        setUserRemove(null);
    }
    // -----------
    useEffect(() => {
        //Recupera usuário
        getUsers();
        //Recupera mensagem 
        (() => {
            const data = getFlashData();
            if (data?.success) setSuccess(data.success);
            if (data?.error) setError(data.error);
        })()
        
    }, []);
    // ======================================================================
    return (
        <>
            { success && <p className="bg-[#6eef01] px-5 text-center rounded-full color-[white] p-1">{success}</p> }
            { error && <p className="bg-[tomato] px-5 text-center rounded-full color-[white] p-1">{error}</p> }
            
            { loading && <div className="flex justify-center"><AppLoader size={50} className="self-center"/></div>}
            { !loading &&  <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    {/* HEADER  */}
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Nome</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Email</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Função</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Admin</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Ações</th>
                        </tr>
                    </thead>

                    {/* DADOS */}
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{user.name}</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{user.email}</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{getRoleDescription(user.role_id)}</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{user.admin ? 'SIM' : 'NÃO'}</td>
                                
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">
                                    <Link href={`/admin/usuarios/editar/${user.id}`}>
                                        <i className="ion-edit text-[20px] text-[#1aab67] mx-[10px] cursor-pointer" />
                                    </Link>
                                    <i className="ion-ios-trash text-[20px] text-[#ed1b2d]  mx-[10px] cursor-pointer" onClick={() => handleRemove(user)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>}

            {userRemove && <AppModal title="Remover usuário">
                <p>Deseja realmente remover o usuário {userRemove.name} ({userRemove.email})?</p>
                <div className="flex justify-between p-[20px]">
                    <AppButton title="Sim" icon="checkmark" form="round" color="#428f01" onClick={handleModalConfirm}/>
                    <AppButton title="Cancelar" icon="close" color="tomato" form="round" onClick={handleModalCancel}/>
                </div>

            </AppModal>}  
        </>
    )
}