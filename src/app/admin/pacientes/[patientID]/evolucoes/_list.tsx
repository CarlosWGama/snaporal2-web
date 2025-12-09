"use client";
import { useEffect, useState } from "react"
import Link from "next/link";
import { AppButton, AppInput, AppLoader, AppModal, AppSelect } from "@/themes/components";
import { getFlashData } from "@/helpers/router";
import ProgressesServices from "@/services/progress";
import { useRouter } from 'next/navigation'
import moment from "moment";

export default function ProgressList({ patientID }: { patientID: number }) {

    const router = useRouter();
    const [progresses, setProgresses] = useState<any[]>([]);
    const [progressRemove, setProgressRemove] = useState<any>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // ======================================================================
    const getProgresses = async () => {
        setLoading(true);
        const { success, progresses } = await ProgressesServices.getAll(patientID);
        if (success && progresses) setProgresses(progresses);
        setLoading(false);
    }
    // -----------
    const handleRemove = async (progress: any) => {
        setProgressRemove(progress);
        setSuccess(null);
        setError(null);
    }
    // -----------
    const handleModalConfirm = async () => {
        setProgressRemove(null);
        setLoading(true);
        await ProgressesServices.delete(progressRemove);
        await getProgresses();
        setSuccess('Evolução excluida com sucesso!');
    }
    // -----------
    const handleModalCancel = async () => {
        setProgressRemove(null);
    }
    // -----------
    useEffect(() => {
        //Recupera evolução
        getProgresses();
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
            {success && <p className="bg-[#6eef01] px-5 text-center rounded-full color-[white] p-1">{success}</p>}
            {error && <p className="bg-[tomato] px-5 text-center rounded-full color-[white] p-1">{error}</p>}

            {loading && <div className="flex justify-center"><AppLoader size={50} className="self-center" /></div>}
            {!loading && <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    {/* HEADER  */}
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Data</th>
                            <th className="py-2 px-4 border-b border-gray-200 text-right text-sm font-semibold text-gray-600">Opções</th>
                        </tr>
                    </thead>

                    {/* DADOS */}
                    <tbody>
                        {progresses.map(progress => (
                            <tr key={progress.id}>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm">{moment(progress.date).format('DD/MM/YYYY')}</td>

                                <td className="py-2 px-4 border-b border-gray-200 text-sm text-right">
                                    <Link href={`/admin/pacientes/${patientID}/evolucoes/editar/${progress.id}`}>
                                        <i className="ion-edit text-[20px] text-[#1aab67] mx-[10px] cursor-pointer" />
                                    </Link>
                                    <i className="ion-ios-trash text-[20px] text-[#ed1b2d]  mx-[10px] cursor-pointer" onClick={() => handleRemove(progress)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>}

            {progressRemove && <AppModal title="Remover evolução">
                <p>Deseja realmente remover a evolução de {moment(progressRemove.date).format('DD/MM/YYYY')}?</p>
                <div className="flex justify-between p-[20px]">
                    <AppButton title="Sim" icon="checkmark" form="round" color="#428f01" onClick={handleModalConfirm} />
                    <AppButton title="Cancelar" icon="close" color="tomato" form="round" onClick={handleModalCancel} />
                </div>

            </AppModal>}
        </>
    )
}