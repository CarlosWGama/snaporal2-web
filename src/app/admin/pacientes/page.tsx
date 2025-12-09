import { AppButton, AppMainContainer } from "@/themes/components";
import PatientsList from "./_list";

export const metadata = {
    title: 'Lista de pacientes'
}
// ==========================================================
export default function PatientesPage() {

    // ==========================================================
    return (
        <AppMainContainer title="Pacientes">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-[20px]">Lista de pacientes</h1>

                <AppButton title='Novo paciente' form="round" type="outline" icon="person-add" href="/admin/pacientes/novo" />
            </div>

            <PatientsList />
        </AppMainContainer>
    )
}