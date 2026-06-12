import { useSimulatorStore } from "../../store/simulatorStore";

export function StatsBar() {
  const people = useSimulatorStore((state) => state.people);
  const total = people.length;
  const arrived = people.filter((person) => person.arrived).length;
  const seated = people.filter((person) => person.tableId).length;
  const spent = people.filter((person) => person.spent).length;

  return (
    <section className="mx-auto mb-4 grid w-full max-w-[1540px] grid-cols-4 gap-3 max-md:grid-cols-2" aria-label="Özet">
      <StatCard label="Toplam" value={total} />
      <StatCard label="Geldi" value={arrived} />
      <StatCard label="Masada" value={seated} />
      <StatCard label="Harcayan" value={spent} />
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <strong className="block text-2xl leading-none">{value}</strong>
      <span className="mt-1 block text-xs font-bold uppercase text-slate-500">{label}</span>
    </div>
  );
}
