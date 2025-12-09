import { AppMainContainer } from "@/themes/components";
import ProgressForm from "./_form";

export const metadata = {
    title: 'Cadastrar evolução'
}

// ===========================================================================
export default async function NewProgressPage({ params }: { params: { patientID: string } }) {

    const { patientID } = await params;

    // ===========================================================================
    return (
        <AppMainContainer title="Novo usuário">
            <ProgressForm patientID={Number(patientID)} />
        </AppMainContainer>
    )
}