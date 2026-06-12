import { useState } from "react";
import { BulkAddModal } from "../BulkAddModal/BulkAddModal";
import { DataTransferModal } from "../DataTransferModal/DataTransferModal";
import { PeoplePanel } from "../PeoplePanel/PeoplePanel";
import { StatsBar } from "../StatsBar/StatsBar";
import { TablesPanel } from "../TablesPanel/TablesPanel";
import { useSimulatorStore } from "../../store/simulatorStore";

export function AppShell() {
  const resetAll = useSimulatorStore((state) => state.resetAll);
  const [isBulkAddOpen, setIsBulkAddOpen] = useState(false);
  const [transferMode, setTransferMode] = useState<"export" | "import" | null>(null);

  const handleReset = () => {
    if (window.confirm("Tüm kişiler ve masa yerleşimi sıfırlansın mı?")) {
      resetAll();
    }
  };

  return (
    <main className="grid h-screen grid-rows-[auto_auto_minmax(0,1fr)] overflow-hidden bg-slate-100 px-4 py-5 text-slate-900">
      <header className="mx-auto flex w-full max-w-[1540px] items-end justify-between gap-4 pb-4">
        <div>
          <h1 className="text-3xl font-bold leading-tight">Ceyart Simulator</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Kişileri ekle, geliş ve harcama durumunu takip et, masalara yerleştir.</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" className="btn" onClick={() => setTransferMode("export")}>
            Dışa aktar
          </button>
          <button type="button" className="btn" onClick={() => setTransferMode("import")}>
            İçe aktar
          </button>
          <button type="button" className="btn" onClick={() => setIsBulkAddOpen(true)}>
            Listeden ekle
          </button>
          <button type="button" className="btn-danger" onClick={handleReset}>
            Sıfırla
          </button>
        </div>
      </header>
      <StatsBar />
      <section className="mx-auto grid min-h-0 w-full max-w-[1540px] grid-cols-[minmax(360px,450px)_1fr] gap-4 max-lg:grid-cols-1 max-lg:overflow-auto">
        <PeoplePanel />
        <TablesPanel />
      </section>
      {isBulkAddOpen ? <BulkAddModal onClose={() => setIsBulkAddOpen(false)} /> : null}
      {transferMode ? <DataTransferModal mode={transferMode} onClose={() => setTransferMode(null)} /> : null}
    </main>
  );
}
