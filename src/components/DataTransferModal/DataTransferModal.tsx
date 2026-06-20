import { FormEvent, useState } from "react"
import type { ComponentProps } from "react"
import { cn } from "../../lib/cn"
import { useSimulatorStore } from "../../store/simulatorStore"
import { Button } from "../Button/Button"

export type DataTransferModalProps = ComponentProps<"div"> & {
  mode: "export" | "import"
  onClose: () => void
}

export function DataTransferModal(props: DataTransferModalProps) {
  const { mode, onClose, className, ...attrs } = props
  const exportState = useSimulatorStore((state) => state.exportState)
  const importState = useSimulatorStore((state) => state.importState)
  const importPeopleFromText = useSimulatorStore((state) => state.importPeopleFromText)
  const [value, setValue] = useState(() => (mode === "export" ? JSON.stringify(exportState(), null, 2) : ""))
  const [message, setMessage] = useState("")
  const isExport = mode === "export"

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setMessage("JSON panoya kopyalandı")
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isExport) return

    const trimmedValue = value.trim()
    if (!trimmedValue) {
      setMessage("İçe aktarılacak veri yok")
      return
    }

    try {
      const ok = importState(JSON.parse(trimmedValue))
      if (!ok) {
        setMessage("JSON formatı uygun değil")
        return
      }
      setMessage("JSON içe aktarıldı")
      onClose()
    }
    catch {
      const added = importPeopleFromText(trimmedValue)
      if (!added) {
        setMessage("Liste formatı okunamadı")
        return
      }
      setMessage(`${added} kişi içe aktarıldı`)
      onClose()
    }
  }

  return (
    <div
      {...attrs}
      className={cn("fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-6 backdrop-blur-sm", className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="data-transfer-title"
    >
      <form className="grid w-full max-w-2xl gap-4 rounded-[28px] border border-slate-950/10 bg-white/95 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="data-transfer-title" className="text-lg font-[760]">{isExport ? "Dışa aktar" : "İçe aktar"}</h2>
            <p className="mt-1 text-sm font-[520] text-slate-500">{isExport ? "Bu JSON'u kopyalayıp başka cihaza veya v1 uygulamasına taşıyabilirsin." : "JSON veya numara isim cinsiyet listesini buraya yapıştır."}</p>
          </div>
          <Button size="square" onClick={onClose} aria-label="Kapat">×</Button>
        </div>
        <textarea
          className="min-h-96 resize-y rounded-2xl border border-slate-950/10 bg-slate-950/[0.025] p-3 font-mono text-xs text-slate-900 outline-none transition focus:border-slate-950/20 focus:bg-white focus:ring-4 focus:ring-slate-950/[0.04]"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          readOnly={isExport}
          placeholder={isExport ? "{ ... }" : "1 Elif Arslan —\n2 Kadir Yazıcı —\n3 Enes Öz Erkek"}
          autoFocus
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-[680] text-slate-500">{message}</span>
          <div className="flex gap-2">
            <Button onClick={onClose}>Kapat</Button>
            {isExport ? (
              <Button color="primary" onClick={handleCopy}>Kopyala</Button>
            ) : (
              <Button type="submit" color="primary">İçe aktar</Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
