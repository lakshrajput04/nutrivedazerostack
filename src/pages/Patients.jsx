import { useMemo, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { Card, EmptyState, Notice, PageHeader, Spinner } from '../components/ui';
import PatientTable from '../components/PatientTable';
import usePatientsData from '../lib/usePatientsData';

const DOSHA_FILTERS = [
  ['all', 'All'],
  ['vata', 'Vata'],
  ['pitta', 'Pitta'],
  ['kapha', 'Kapha'],
  ['tridoshic', 'Tridoshic'],
];

const PLAN_FILTERS = [
  ['all', 'Any plan status'],
  ['ready', 'Plan ready'],
  ['none', 'No plan yet'],
];

const Patients = () => {
  const { patients, plans, loading, error } = usePatientsData();
  const [query, setQuery] = useState('');
  const [dosha, setDosha] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients.filter((p) => {
      if (q && !`${p.name} ${p.phone || ''}`.toLowerCase().includes(q)) return false;
      // Combined doshas (e.g. vata-pitta) match each of their elements
      if (dosha !== 'all' && !(p.dosha || '').split(/[-_]/).includes(dosha)) return false;
      if (planFilter === 'ready' && !plans[p.id]) return false;
      if (planFilter === 'none' && plans[p.id]) return false;
      return true;
    });
  }, [patients, plans, query, dosha, planFilter]);

  return (
    <>
      <PageHeader
        title="Patients"
        description={loading ? 'Loading...' : `${patients.length} registered patients`}
      />

      <Notice status={error && { type: 'error', text: `Couldn't load patients: ${error}` }} className="mb-6" />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-ink-200 p-4 lg:flex-row lg:items-center">
          <div className="relative lg:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or phone"
              aria-label="Search patients"
              className="input pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by dosha">
            {DOSHA_FILTERS.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setDosha(value)}
                aria-pressed={dosha === value}
                className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
                  dosha === value ? 'bg-brand-600 text-white' : 'text-ink-600 hover:bg-ink-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            aria-label="Filter by plan status"
            className="input lg:ml-auto lg:w-48"
          >
            {PLAN_FILTERS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <Spinner label="Loading patients..." />
        ) : filtered.length ? (
          <PatientTable patients={filtered} plans={plans} />
        ) : (
          <EmptyState
            icon={Users}
            title={patients.length ? 'No matching patients' : 'No patients yet'}
            description={patients.length ? 'Try a different search or filter.' : 'Register your first patient to get started.'}
          />
        )}
      </Card>
    </>
  );
};

export default Patients;
