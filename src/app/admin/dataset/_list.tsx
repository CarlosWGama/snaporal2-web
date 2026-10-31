"use client";

import { useEffect, useState } from "react";
import { AppButton, AppInput, AppLoader, AppModal, AppSelect } from "@/themes/components";
import DatasetServices, { DatasetItem, DatasetPathologyType } from "@/services/dataset";

export default function DatasetList() {
  const [page, setPage] = useState<number>(1);
  const [items, setItems] = useState<DatasetItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<DatasetItem | null>(null);
  const [filter, setFilter] = useState<{
    name: string;
    email: string;
    type: '' | DatasetPathologyType;
  }>({
    name: "",
    email: "",
    type: "",
  });

  // ======================================================================
  // CARREGAR DADOS DO DATASET
  // ======================================================================
  const loadDataset = async (pageNumber: number) => {
    setLoading(true);
    setError(null);

    const activeFilters: {
      name?: string;
      email?: string;
      type?: DatasetPathologyType;
    } = {};

    if (filter.name.trim()) activeFilters.name = filter.name.trim();
    if (filter.email.trim()) activeFilters.email = filter.email.trim();
    if (filter.type) activeFilters.type = filter.type;

    const response = await DatasetServices.getAll(pageNumber, activeFilters);

    if (response.success && response.data) {
      setItems(response.data);
    } else {
      setItems([]);
      setError(response.error || "Erro ao carregar registros do dataset.");
    }

    setLoading(false);
  };

  // ----------------------------------------------------------------------
  // FILTRAGEM
  // ----------------------------------------------------------------------
  const handleFilter = () => {
    setPage(1);
    loadDataset(1);
  };

  // ----------------------------------------------------------------------
  // NAVEGAÇÃO DE PÁGINAS
  // ----------------------------------------------------------------------
  const handlePage = (direction: "prev" | "next") => {
    const newPage = direction === "prev" ? Math.max(1, page - 1) : page + 1;
    setPage(newPage);
    loadDataset(newPage);
  };

  // ----------------------------------------------------------------------
  // DOWNLOAD DA IMAGEM
  // ----------------------------------------------------------------------
  const handleDownload = async (item: DatasetItem) => {
    try {
      const response = await fetch(item.image_url);
      if (!response.ok) throw new Error("Falha ao obter imagem");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Extrai ou gera um nome amigável para o arquivo
      const urlParts = item.image_url.split("/");
      const fileName = urlParts[urlParts.length - 1] || `imagem_${item.type}_${Date.now()}.jpg`;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback: abrir a URL diretamente para download do navegador
      const link = document.createElement("a");
      link.href = item.image_url;
      link.target = "_blank";
      link.download = `imagem_${item.type}.jpg`;
      link.click();
    }
  };

  // ----------------------------------------------------------------------
  useEffect(() => {
    loadDataset(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ======================================================================
  return (
    <>
      {/* FILTROS */}
      <h3 className="text-[18px] font-bold">Filtros</h3>
      <div className="flex flex-col border-b-[2px] border-[#dedede] p-2 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <AppInput
            type="text"
            name="name"
            label="Nome"
            placeholder="Filtrar por nome"
            value={filter.name}
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          />

          <AppInput
            type="email"
            name="email"
            label="Email"
            placeholder="Filtrar por email"
            value={filter.email}
            onChange={(e) => setFilter({ ...filter, email: e.target.value })}
          />

          <AppSelect
            name="type"
            label="Tipo"
            value={filter.type}
            onChange={(e) =>
              setFilter({
                ...filter,
                type: e.target.value as '' | DatasetPathologyType,
              })
            }
          >
            <option value="">Todos</option>
            <option value="cancer">Câncer</option>
            <option value="qa">QA</option>
            <option value="eritroplasia">Eritroplasia</option>
            <option value="leucoplasia">Leucoplasia</option>
          </AppSelect>
        </div>

        <div className="mt-2">
          <AppButton
            title="Filtrar"
            className="w-[110px]"
            type="outline"
            icon="funnel"
            onClick={handleFilter}
          />
        </div>
      </div>

      {/* FEEDBACK DE ERRO */}
      {error && (
        <p className="bg-[tomato] text-white px-5 text-center rounded-full p-2 my-3">
          {error}
        </p>
      )}

      {/* CARREGAMENTO */}
      {loading && (
        <div className="flex justify-center my-10">
          <AppLoader size={50} className="self-center" />
        </div>
      )}

      {/* TABELA DE REGISTROS */}
      {!loading && (
        <div className="overflow-x-auto">
          {items.length === 0 ? (
            <div className="bg-white p-8 rounded-lg text-center border border-gray-200">
              <i className="ion-images text-[40px] text-gray-400 mb-2 block" />
              <p className="text-gray-600 font-semibold text-[16px]">
                Nenhuma imagem cadastrada encontrada.
              </p>
            </div>
          ) : (
            <>
              <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
                {/* CABEÇALHO */}
                <thead className="bg-[#111828]">
                  <tr>
                    <th className="py-4 px-4 border-b border-gray-200 text-left text-sm font-semibold text-white">
                      Data Envio
                    </th>
                    <th className="py-4 px-4 border-b border-gray-200 text-left text-sm font-semibold text-white">
                      Usuário
                    </th>
                    <th className="py-4 px-4 border-b border-gray-200 text-center text-sm font-semibold text-white">
                      Imagem
                    </th>
                    <th className="py-4 px-4 border-b border-gray-200 text-left text-sm font-semibold text-white">
                      Tipo
                    </th>
                    <th className="py-4 px-4 border-b border-gray-200 text-center text-sm font-semibold text-white">
                      Confiança
                    </th>
                    <th className="py-4 px-4 border-b border-gray-200 text-center text-sm font-semibold text-white">
                      Classificação
                    </th>
                    <th className="py-4 px-4 border-b border-gray-200 text-center text-sm font-semibold text-white">
                      Ações
                    </th>
                  </tr>
                </thead>

                {/* CORPO */}
                <tbody>
                  {items.map((item, index) => {
                    const userName = item.user?.name || "Não informado";
                    const userEmail = item.user?.email || "sem email";

                    return (
                      <tr
                        key={`${item.image_url}-${index}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* DATA ENVIO */}
                        <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                          {item.created_at || "-"}
                        </td>

                        {/* USUÁRIO */}
                        <td className="py-3 px-4 border-b border-gray-200 text-sm">
                          <span className="font-semibold text-gray-900 block">
                            {userName}
                          </span>
                          <span className="text-gray-500 text-xs">
                            ({userEmail})
                          </span>
                        </td>

                        {/* IMAGEM / MINIATURA */}
                        <td className="py-3 px-4 border-b border-gray-200 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedImage(item)}
                            title="Clique para ampliar"
                            className="inline-block focus:outline-none"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image_url}
                              alt={`Imagem de ${item.type}`}
                              className="w-[50px] h-[50px] object-cover rounded-md border border-gray-300 hover:scale-105 transition-transform cursor-pointer"
                            />
                          </button>
                        </td>

                        {/* TIPO */}
                        <td className="py-3 px-4 border-b border-gray-200 text-sm font-medium text-gray-800 capitalize">
                          {item.type}
                        </td>

                        {/* CONFIANÇA */}
                        <td className="py-3 px-4 border-b border-gray-200 text-sm text-center font-bold text-gray-900">
                          {typeof item.assurance === "number"
                            ? `${item.assurance.toFixed(2)}%`
                            : item.assurance
                            ? `${item.assurance}%`
                            : "-"}
                        </td>

                        {/* CLASSIFICAÇÃO */}
                        <td className="py-3 px-4 border-b border-gray-200 text-center text-sm">
                          {item.positive ? (
                            <span className="inline-block bg-[#1aab67] text-white px-3 py-1 rounded-full text-xs font-bold">
                              Positivo
                            </span>
                          ) : (
                            <span className="inline-block bg-[#6b7280] text-white px-3 py-1 rounded-full text-xs font-bold">
                              Negativo
                            </span>
                          )}
                        </td>

                        {/* AÇÕES / DOWNLOAD */}
                        <td className="py-3 px-4 border-b border-gray-200 text-center text-sm">
                          <button
                            type="button"
                            title="Baixar imagem"
                            onClick={() => handleDownload(item)}
                            className="bg-[#111828] hover:bg-[#1f2937] text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                          >
                            <i className="ion-android-download text-[14px]" />
                            <span>Baixar</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* PAGINAÇÃO */}
              <div className="flex justify-between items-center mt-5 mb-8">
                <span className="text-sm text-gray-600 font-medium">
                  Página <strong className="text-gray-900">{page}</strong> (10 itens por página)
                </span>

                <div className="flex gap-2">
                  <AppButton
                    title="Anterior"
                    icon="arrow-left-a"
                    form="round"
                    disabled={page <= 1}
                    onClick={() => handlePage("prev")}
                  />
                  <AppButton
                    title="Próximo"
                    icon="arrow-right-a"
                    form="round"
                    disabled={items.length < 10}
                    onClick={() => handlePage("next")}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* MODAL DE PRÉ-VISUALIZAÇÃO AMPLIADA */}
      {selectedImage && (
        <AppModal
          title="Visualizar Imagem"
          onClose={() => setSelectedImage(null)}
        >
          <div className="flex flex-col items-center">
            <div className="max-h-[400px] overflow-hidden rounded-lg mb-4 border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.image_url}
                alt={`Ampliação ${selectedImage.type}`}
                className="max-h-[400px] w-auto object-contain"
              />
            </div>

            <div className="w-full bg-gray-50 p-4 rounded-lg mb-5 text-sm space-y-1">
              <p>
                <strong>Usuário:</strong> {selectedImage.user?.name || "Não informado"} (
                {selectedImage.user?.email || "sem email"})
              </p>
              <p>
                <strong>Tipo:</strong> <span className="capitalize">{selectedImage.type}</span>
              </p>
              <p>
                <strong>Confiança:</strong>{" "}
                {typeof selectedImage.assurance === "number"
                  ? `${selectedImage.assurance.toFixed(2)}%`
                  : `${selectedImage.assurance}%`}
              </p>
              <p>
                <strong>Classificação:</strong>{" "}
                {selectedImage.positive ? "Positivo" : "Negativo"}
              </p>
              <p>
                <strong>Data de Envio:</strong> {selectedImage.created_at || "-"}
              </p>
            </div>

            <div className="flex justify-between w-full">
              <AppButton
                title="Baixar Imagem"
                icon="android-download"
                form="round"
                color="#111828"
                onClick={() => handleDownload(selectedImage)}
              />
              <AppButton
                title="Fechar"
                icon="close"
                form="round"
                color="tomato"
                onClick={() => setSelectedImage(null)}
              />
            </div>
          </div>
        </AppModal>
      )}
    </>
  );
}
