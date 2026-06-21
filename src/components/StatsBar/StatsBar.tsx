import type { ComponentProps } from "react"
import { cn } from "../../lib/cn"
import { useSimulatorStore } from "../../store/simulatorStore"

export type StatsBarProps = ComponentProps<"section">

export function StatsBar(props: StatsBarProps) {
  const { className, ...attrs } = props
  const people = useSimulatorStore((state) => state.people)
  const total = people.length
  const seated = people.filter((person) => person.tableId).length

  return (
    <section
      {...attrs}
      className={cn("hidden grid-cols-3 gap-2 xl:grid", className)}
      aria-label="Özet"
    >
      <StatCard label="Toplam" value={total} />
      <StatCard label="Masada" value={seated} />
    </section>
  )
}

type StatCardProps = ComponentProps<"div"> & {
  label: string
  value: number
}

function StatCard(props: StatCardProps) {
  const { label, value, className, ...attrs } = props

  return (
    <div
      {...attrs}
      className={cn("min-w-20 rounded-2xl border border-slate-950/10 bg-white/60 px-3 py-2 shadow-sm shadow-slate-950/[0.03]", className)}
    >
      <strong className="block text-base font-[760] leading-none text-slate-900">{value}</strong>
      <span className="mt-1 block text-[10px] font-[720] uppercase text-slate-500">{label}</span>
    </div>
  )
}
