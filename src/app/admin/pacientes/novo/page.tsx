import { AppMainContainer } from "@/themes/components";
import PatientForm from "./_form";

export const metadata = {
    title: 'Cadastrar paciente'
}

// ===========================================================================
export default function NewPatientPage() {

    // ===========================================================================
    return (
        <AppMainContainer title="Novo paciente">
            <PatientForm />
        </AppMainContainer>
    )
}