import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { DoshaBadge, PlanStatus } from './ui';
import { capitalize, formatBmi, formatDate } from '../lib/format';

export const planLink = (patient) =>
  `/diet-plans?patientId=${patient.id}&name=${encodeURIComponent(patient.name)}`;

// plans: { [patientId]: { generatedAt } } for patients with a saved diet plan
// compact: fewer columns, for use inside narrower cards
const PatientTable = ({ patients, plans, compact = false }) => (
  <>
    {/* Desktop: table */}
    <table className="hidden w-full text-left text-sm md:table">
      <thead>
        <tr className="border-b border-ink-200 text-xs font-medium uppercase tracking-wide text-ink-500">
          <th className="px-5 py-3 font-medium">Name</th>
          <th className="px-5 py-3 font-medium">Dosha</th>
          <th className="px-5 py-3 font-medium">Age</th>
          {!compact && <th className="px-5 py-3 font-medium">BMI</th>}
          {!compact && <th className="px-5 py-3 font-medium">Conditions</th>}
          <th className="whitespace-nowrap px-5 py-3 font-medium">Diet plan</th>
          <th className="px-5 py-3" aria-label="Open" />
        </tr>
      </thead>
      <tbody className="divide-y divide-ink-100">
        {patients.map((patient) => (
          <tr key={patient.id} className="group hover:bg-ink-50">
            <td className="px-5 py-3">
              <Link to={planLink(patient)} className="font-medium text-ink-900 hover:text-brand-700">
                {patient.name}
              </Link>
              <div className="whitespace-nowrap text-xs text-ink-500">Added {formatDate(patient.createdAt)}</div>
            </td>
            <td className="px-5 py-3"><DoshaBadge dosha={patient.dosha} /></td>
            <td className="whitespace-nowrap px-5 py-3 text-ink-600">
              {patient.age} <span className="text-ink-400">· {capitalize(patient.gender)}</span>
            </td>
            {!compact && <td className="px-5 py-3 tabular-nums text-ink-600">{formatBmi(patient.bmi)}</td>}
            {!compact && (
              <td className="max-w-[14rem] truncate px-5 py-3 text-ink-600">
                {patient.condition?.filter((c) => c && c !== 'None').join(', ') || <span className="text-ink-400">None</span>}
              </td>
            )}
            <td className="whitespace-nowrap px-5 py-3"><PlanStatus hasPlan={Boolean(plans[patient.id])} /></td>
            <td className="whitespace-nowrap px-5 py-3 text-right">
              <Link
                to={planLink(patient)}
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 opacity-70 group-hover:opacity-100"
              >
                {plans[patient.id] ? 'View plan' : 'Create plan'}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Mobile: stacked list */}
    <ul className="divide-y divide-ink-100 md:hidden">
      {patients.map((patient) => (
        <li key={patient.id}>
          <Link to={planLink(patient)} className="flex items-center gap-3 px-4 py-3 active:bg-ink-50">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium text-ink-900">{patient.name}</span>
                <DoshaBadge dosha={patient.dosha} />
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-ink-500">
                <span>{patient.age} · {capitalize(patient.gender)} · BMI {formatBmi(patient.bmi)}</span>
                <PlanStatus hasPlan={Boolean(plans[patient.id])} />
              </div>
            </div>
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-ink-400" />
          </Link>
        </li>
      ))}
    </ul>
  </>
);

export default PatientTable;
