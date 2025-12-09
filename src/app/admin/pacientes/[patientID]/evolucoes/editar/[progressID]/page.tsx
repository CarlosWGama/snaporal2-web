import { AppMainContainer } from "@/themes/components";
import ProgressForm from "./_form";

export const metadata = {
    title: 'Editar evolução'
}

// ===========================================================================
export default async function UsersEditarPage({ params }: any) {

    const { progressID, patientID } = await params;

    // ===========================================================================
    return (
        <AppMainContainer title="Editar evolução">
            <ProgressForm progressID={progressID} patientID={patientID} />
        </AppMainContainer>
    )
}