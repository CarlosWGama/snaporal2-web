import { AppMainContainer } from "@/themes/components";
import DatasetList from "./_list";

export const metadata = {
  title: 'Dataset',
};

// ==========================================================
export default function DatasetPage() {
  return (
    <AppMainContainer title="Dataset">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-[20px]">Imagens do Dataset</h1>
      </div>

      <DatasetList />
    </AppMainContainer>
  );
}
