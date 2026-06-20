import { useSimulatorStore } from "../../store/simulatorStore";

export function StatsBar() {
  const people = useSimulatorStore((state) => state.people);
  const total = people.length;
  const arrived = people.filter((person) => person.arrived).length;
  const seated = people.filter((person) => person.tableId).length;

  return (
    <section className="hidden grid-cols-3 gap-2 xl:grid" aria-label="Özet">
      <StatCard label="Toplam" value={total} />
      <StatCard label="Geldi" value={arrived} />
      <StatCard label="Masada" value={seated} />
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-20 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <strong className="block text-base leading-none">{value}</strong>
      <span className="mt-1 block text-[10px] font-bold uppercase text-slate-500">{label}</span>
    </div>
  );
}
