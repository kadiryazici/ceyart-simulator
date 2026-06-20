import { HugeiconsIcon } from "@hugeicons/react";
import Add01Icon from "@hugeicons/core-free-icons/Add01Icon";
import DiningTableIcon from "@hugeicons/core-free-icons/DiningTableIcon";
import { useSimulatorStore } from "../../store/simulatorStore";

export function EmptyState() {
  const addTable = useSimulatorStore((state) => state.addTable);

  return (
    <div className="grid min-h-full place-items-center rounded-lg border border-dashed border-slate-300 bg-white p-6">
      <div className="grid max-w-md justify-items-center text-center">
        <div className="relative mb-6 h-40 w-64 max-w-full">
          <div className="absolute left-1/2 top-10 h-24 w-44 -translate-x-1/2 rounded-[50%] border border-slate-200 bg-slate-50" />
          <div className="absolute left-1/2 top-14 grid h-20 w-20 -translate-x-1/2 place-items-center rounded-full border border-blue-100 bg-blue-50 text-blue-700 shadow-sm">
            <HugeiconsIcon icon={DiningTableIcon} size={42} strokeWidth={1.7} />
          </div>
          <div className="absolute bottom-7 left-7 h-9 w-16 rounded-lg border border-slate-200 bg-white shadow-sm" />
          <div className="absolute bottom-7 right-7 h-9 w-16 rounded-lg border border-slate-200 bg-white shadow-sm" />
          <div className="absolute bottom-2 left-1/2 h-2 w-44 -translate-x-1/2 rounded-full bg-slate-200/80" />
        </div>
        <h2 className="text-xl font-bold">Henüz masa yok</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          Yerleşime başlamak için ilk masayı ekle. Kişileri sol panelden seçip masaya taşıyabilirsin.
        </p>
        <button type="button" className="btn-primary mt-5" onClick={addTable}>
          <HugeiconsIcon icon={Add01Icon} size={18} />
          <span>Masa ekle</span>
        </button>
      </div>
    </div>
  );
}
