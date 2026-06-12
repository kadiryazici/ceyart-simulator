import { FormEvent, useState } from "react";
import { useSimulatorStore } from "../../store/simulatorStore";

type DataTransferModalProps = {
  mode: "export" | "import";
  onClose: () => void;
};

export function DataTransferModal({ mode, onClose }: DataTransferModalProps) {
  const exportState = useSimulatorStore((state) => state.exportState);
  const importState = useSimulatorStore((state) => state.importState);
  const [value, setValue] = useState(() => (mode === "export" ? JSON.stringify(exportState(), null, 2) : ""));
  const [message, setMessage] = useState("");
  const isExport = mode === "export";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setMessage("JSON panoya kopyalandı");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isExport) return;

    try {
      const ok = importState(JSON.parse(value));
      if (!ok) {
        setMessage("JSON formatı uygun değil");
        return;
      }
      setMessage("JSON içe aktarıldı");
      onClose();
    } catch {
      setMessage("JSON okunamadı");
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4" role="dialog" aria-modal="true" aria-labelledby="data-transfer-title">
      <form className="grid w-full max-w-2xl gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-2xl" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="data-transfer-title" className="text-lg font-bold">{isExport ? "Dışa aktar" : "İçe aktar"}</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">{isExport ? "Bu JSON'u kopyalayıp başka cihaza veya v1 uygulamasına taşıyabilirsin." : "Daha önce dışa aktarılan JSON'u buraya yapıştır."}</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Kapat">×</button>
        </div>
        <textarea
          className="min-h-96 resize-y rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          readOnly={isExport}
          placeholder="{ ... }"
          autoFocus
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-slate-500">{message}</span>
          <div className="flex gap-2">
            <button type="button" className="btn" onClick={onClose}>Kapat</button>
            {isExport ? (
              <button type="button" className="btn-primary" onClick={handleCopy}>Kopyala</button>
            ) : (
              <button type="submit" className="btn-primary">İçe aktar</button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
