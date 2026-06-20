import { useState } from "react";
import { Menu } from "@base-ui/react/menu";
import { HugeiconsIcon } from "@hugeicons/react";
import Add01Icon from "@hugeicons/core-free-icons/Add01Icon";
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";
import MoreVerticalIcon from "@hugeicons/core-free-icons/MoreVerticalIcon";
import RefreshIcon from "@hugeicons/core-free-icons/RefreshIcon";
import ShuffleIcon from "@hugeicons/core-free-icons/ShuffleIcon";
import Upload01Icon from "@hugeicons/core-free-icons/Upload01Icon";
import { DataTransferModal } from "../DataTransferModal/DataTransferModal";
import { PeoplePanel } from "../PeoplePanel/PeoplePanel";
import { StatsBar } from "../StatsBar/StatsBar";
import { TablesPanel } from "../TablesPanel/TablesPanel";
import { useSimulatorStore } from "../../store/simulatorStore";

export function AppShell() {
  const resetAll = useSimulatorStore((state) => state.resetAll);
  const addTable = useSimulatorStore((state) => state.addTable);
  const randomDistribute = useSimulatorStore((state) => state.randomDistribute);
  const selectedPersonId = useSimulatorStore((state) => state.selectedPersonId);
  const people = useSimulatorStore((state) => state.people);
  const [transferMode, setTransferMode] = useState<"export" | "import" | null>(null);
  const [message, setMessage] = useState("");
  const selectedPerson = people.find((person) => person.id === selectedPersonId);

  const handleRandom = () => {
    const placed = randomDistribute();
    setMessage(placed ? `${placed} kişi rastgele dağıtıldı` : "Dağıtılacak uygun kişi veya masa yok");
  };

  const handleReset = () => {
    if (window.confirm("Tüm kişiler ve masa yerleşimi sıfırlansın mı?")) {
      resetAll();
      setMessage("");
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-100 text-slate-900 lg:h-screen lg:grid-cols-[minmax(340px,420px)_1fr] lg:overflow-hidden">
      <PeoplePanel />
      <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)]">
        <header className="flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900">Masalar</div>
            <div className="truncate text-xs font-bold text-slate-500">
              {selectedPerson ? `${selectedPerson.name} seçili` : message || "Kişi seçip masaya tıkla"}
            </div>
          </div>
          <div className="flex min-w-0 items-center justify-end gap-3">
            <StatsBar />
            <div className="flex items-center gap-2">
              <button type="button" className="btn" onClick={handleRandom}>
                <HugeiconsIcon icon={ShuffleIcon} size={18} />
                <span>Rastgele dağıt</span>
              </button>
              <button type="button" className="btn-primary" onClick={addTable}>
                <HugeiconsIcon icon={Add01Icon} size={18} />
                <span>Masa ekle</span>
              </button>
              <Menu.Root>
                <Menu.Trigger className="icon-btn h-10 w-10" aria-label="Diğer işlemler">
                  <HugeiconsIcon icon={MoreVerticalIcon} size={20} />
                </Menu.Trigger>
                <Menu.Portal>
                  <Menu.Positioner sideOffset={8} align="end">
                    <Menu.Popup className="menu-popup">
                      <Menu.Item className="menu-item" onClick={() => setTransferMode("export")}>
                        <HugeiconsIcon icon={Download01Icon} size={18} />
                        <span>Dışa aktar</span>
                      </Menu.Item>
                      <Menu.Item className="menu-item" onClick={() => setTransferMode("import")}>
                        <HugeiconsIcon icon={Upload01Icon} size={18} />
                        <span>İçe aktar</span>
                      </Menu.Item>
                      <Menu.Separator className="menu-separator" />
                      <Menu.Item className="menu-item text-red-700" onClick={handleReset}>
                        <HugeiconsIcon icon={RefreshIcon} size={18} />
                        <span>Sıfırla</span>
                      </Menu.Item>
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            </div>
          </div>
        </header>
        <TablesPanel />
      </section>
      {transferMode ? <DataTransferModal mode={transferMode} onClose={() => setTransferMode(null)} /> : null}
    </main>
  );
}
