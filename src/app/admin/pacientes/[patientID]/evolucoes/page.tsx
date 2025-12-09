import { AppButton, AppMainContainer } from "@/themes/components";
import ProgressList from "./_list";

export const metadata = {
    title: 'Lista de evoluções'
}
// ==========================================================
export default async function ProgressPage({ params }: { params: { patientID: string } }) {

    const { patientID } = await params;

    // ==========================================================
    return (
        <AppMainContainer title="Evoluções">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-[20px]">Lista de evoluções</h1>

                <AppButton title='Nova evolução' form="round" type="outline" icon="person-add" href={`/admin/pacientes/${patientID}/evolucoes/nova`} />
            </div>

            <ProgressList patientID={Number(patientID)} />
        </AppMainContainer>
    )
}