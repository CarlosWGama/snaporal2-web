"use client";
import { useEffect, useState } from "react"
import Link from "next/link";
import { AppButton, AppInput, AppLoader, AppModal, AppSelect } from "@/themes/components";
import { getFlashData } from "@/helpers/router";
import PatientServices from "@/services/patient";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import moment from "moment";
import { getDescriptionGender } from "../../../helpers/patients";

export default function PatientsList() {

    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const [page, setPage] = useState(Number(params.get('page') ?? 1));
    const [patients, setPatients] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [patientRemove, setPatientRemove] = useState<any>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        name: params.get('name') ?? '',
        gender: params.get('gender') ?? ''
    })

    // ======================================================================
    const getPatients = async (page: number) => {
        setLoading(true);
        const { success, patients, extra } = await PatientServices.getAll(page, filter);
        if (success && patients) setPatients(patients);
        setPagination(extra);
        setLoading(false);
    }
    // -----------
    const handlePage = (type: 'prev' | 'next') => {
        const newPage = type === 'prev' ? page - 1 : page + 1;
        const newParams = new URLSearchParams(params);
        newParams.set('page', newPage.toString());

        router.replace(`${pathname}?${newParams.toString()}`);
        router.refresh();

        setPage(newPage);
        getPatients(newPage);

    }
    // -----------
    const handleRemove = async (patient: any) => {
        setPatientRemove(patient);
        setSuccess(null);
        setError(null);
    }
    // -----------
    const handleModalConfirm = async () => {
        setPatientRemove(null);
        setLoading(true);
        await PatientServices.delete(patientRemove.id);
        await getPatients(1);
        setSuccess('Paciente excluido com sucesso!');
    }
    // -----------
    const handleModalCancel = async () => {
        setPatientRemove(null);
    }
    // -----------
    useEffect(() => {
        //Recupera usuário
        getPatients(page);
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
            <h3 className="text-[18px] font-bold">Filtros</h3>
            <div className="flex flex-col border-b-[2px] border-[#dedede] p-2">
                <div className="flex gap-2">
                    <AppInput type="text" label="Nome" value={filter.name} onChange={(e) => setFilter({ ...filter, name: e.target.value })} />
                    <AppSelect label="Gênero" value={filter.gender} onChange={(e) => setFilter({ ...filter, gender: e.target.value })}>
                        <option value="">Todos</option>
                        <option value="male">Masculino</option>
                        <option value="female">Feminino</option>
                        <option value="other">Outro</option>
                    </AppSelect>
                </div>
                <AppButton title="Filtrar" className="w-[100px]" type="outline" onClick={() => getPatients(page)} />
            </div>


            {success && <p className="bg-[#6eef01] px-5 text-center rounded-full color-[white] p-1">{success}</p>}
            {error && <p className="bg-[tomato] px-5 text-center rounded-full color-[white] p-1">{error}</p>}

            {loading && <div className="flex justify-center"><AppLoader size={50} className="self-center" /></div>}
            {!loading && <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    {/* HEADER  */}
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Nome</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Gênero</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Data de Nascimento</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Criado por</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Editado por</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Ações</th>
                        </tr>
                    </thead>

                    {/* DADOS */}
                    <tbody>
                        {patients.map(patient => (
                            <tr key={patient.id}>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{patient.name}</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{getDescriptionGender(patient.gender)}</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{moment(patient.birth_date).format('DD/MM/YYYY')} ({moment().diff(moment(patient.birth_date), 'years')} anos)</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{patient.created_by_user.name}</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{patient.updated_by_user.name}</td>

                                <td className="py-2 px-4 border-b border-gray-200 text-sm">
                                    <Link href={`/admin/pacientes/${patient.id}/evolucoes`}>
                                        <i className="ion-clipboard text-[20px] text-[blue] mx-[10px] cursor-pointer" />
                                    </Link>
                                    <Link href={`/admin/pacientes/editar/${patient.id}`}>
                                        <i className="ion-edit text-[20px] text-[#1aab67] mx-[10px] cursor-pointer" />
                                    </Link>
                                    <i className="ion-ios-trash text-[20px] text-[#ed1b2d]  mx-[10px] cursor-pointer" onClick={() => handleRemove(patient)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {pagination && <div className="flex justify-end mt-[20px]">
                    {!pagination.firstPage && <AppButton title="Anterior" className="mr-[10px]" icon="arrow-left-a" form="round" onClick={() => handlePage('prev')} />}
                    {!pagination.lastPage && <AppButton title="Proximo" className="ml-[10px]" icon="arrow-right-a" form="round" onClick={() => handlePage('next')} />}
                </div>}
            </div>}

            {patientRemove && <AppModal title="Remover paciente">
                <p>Deseja realmente remover o paciente {patientRemove.name}?</p>
                <div className="flex justify-between p-[20px]">
                    <AppButton title="Sim" icon="checkmark" form="round" color="#428f01" onClick={handleModalConfirm} />
                    <AppButton title="Cancelar" icon="close" color="tomato" form="round" onClick={handleModalCancel} />
                </div>

            </AppModal>}
        </>
    )
}