import { AppMainContainer } from "@/themes/components";
import PatientForm from "./_form";

export const metadata = {
    title: 'Editar paciente'
}

// ===========================================================================
export default async function EditPatientPage({ params }: any) {

    const { patientID } = await params;

    // ===========================================================================
    return (
        <AppMainContainer title="Editar paciente">
            <PatientForm patientID={patientID} />
        </AppMainContainer>
    )
}