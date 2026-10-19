import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button, Card, Field, Input, Notice, PageHeader, Select, TextArea } from '../components/ui';
import { apiRequest } from '../lib/api';
import { capitalize, formatDosha } from '../lib/format';

const OPTIONS = {
  gender: [['male', 'Male'], ['female', 'Female'], ['other', 'Other']],
  region: [['General', 'General'], ['North India', 'North India'], ['South India', 'South India'], ['East India', 'East India'], ['West India', 'West India']],
  dosha: [
    ['vata', 'Vata (air + space)'], ['pitta', 'Pitta (fire + water)'], ['kapha', 'Kapha (earth + water)'],
    ['vata_pitta', 'Vata-Pitta'], ['pitta_kapha', 'Pitta-Kapha'], ['vata_kapha', 'Vata-Kapha'], ['tridoshic', 'Tridoshic (balanced)'],
  ],
  dietary_habits: [['vegetarian', 'Vegetarian'], ['vegan', 'Vegan'], ['eggs', 'Vegetarian + eggs'], ['non-vegetarian', 'Non-vegetarian']],
  weight_goal: [['weight_maintenance', 'Maintain weight'], ['weight_loss', 'Lose weight'], ['weight_gain', 'Gain weight']],
  digestion: [['strong', 'Strong (quick and complete)'], ['regular', 'Regular'], ['weak', 'Weak (slow or incomplete)'], ['irregular', 'Irregular']],
  water_intake: [['less_than_1', 'Less than 1 L'], ['1_to_2', '1-2 L'], ['2_to_3', '2-3 L'], ['more_than_3', 'More than 3 L']],
  activity_level: [
    ['sedentary', 'Sedentary (little exercise)'], ['light', 'Light (1-3 days/week)'], ['moderate', 'Moderate (3-5 days/week)'],
    ['active', 'Active (6-7 days/week)'], ['very_active', 'Very active (physical job + exercise)'],
  ],
  sleep_pattern: [['regular', 'Regular (7-8 h, consistent)'], ['irregular', 'Irregular'], ['early_riser', 'Early riser'], ['night_owl', 'Night owl']],
  stress_level: [['low', 'Low'], ['moderate', 'Moderate'], ['high', 'High'], ['very_high', 'Very high (chronic)']],
  work_type: [['physical', 'Physical / manual'], ['desk', 'Desk job'], ['mixed', 'Mixed'], ['outdoor', 'Outdoor / field'], ['creative', 'Creative']],
  cuisine_preference: [
    ['north_indian', 'North Indian'], ['south_indian', 'South Indian'], ['gujarati', 'Gujarati'], ['maharashtrian', 'Maharashtrian'],
    ['bengali', 'Bengali'], ['punjabi', 'Punjabi'], ['rajasthani', 'Rajasthani'], ['kerala', 'Kerala'],
    ['mixed_indian', 'Mixed Indian'], ['continental', 'Continental'],
  ],
};

const STEPS = [
  { title: 'Basic information', description: 'Who is the patient?' },
  { title: 'Contact', description: 'How to reach them' },
  { title: 'Health profile', description: 'Constitution, diet and body measurements' },
  { title: 'Health metrics', description: 'Digestion, hydration, activity and sleep' },
  { title: 'Lifestyle', description: 'Stress, work and food preferences' },
  { title: 'Review', description: 'Notes and confirmation' },
];

const splitList = (text) => text.split(',').map((item) => item.trim()).filter(Boolean);

const PatientRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [sessionId, setSessionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const [form, setForm] = useState({
    name: '', age: '', gender: '', phone: '',
    email: '', address: '', region: 'General',
    dosha: '', dietary_habits: 'vegetarian', weight_goal: 'weight_maintenance', height: '', weight: '', conditions: '', allergies: '',
    digestion: '', water_intake: '', activity_level: '', sleep_pattern: '',
    stress_level: '', work_type: '', cuisine_preference: '',
    clinical_notes: '', created_by: 'Dr. Practitioner',
  });

  const update = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const field = (name) => ({ name, value: form[name], onChange: update });
  const select = (name, placeholder = 'Select...') => <Select {...field(name)} options={OPTIONS[name]} placeholder={placeholder} />;

  const { bmi, bmr } = (() => {
    const height = parseFloat(form.height);
    const weight = parseFloat(form.weight);
    const age = parseFloat(form.age);
    if (!height || !weight) return {};
    const result = { bmi: (weight / (height / 100) ** 2).toFixed(1) };
    // Mifflin-St Jeor
    if (age && form.gender === 'male') result.bmr = Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    if (age && form.gender === 'female') result.bmr = Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    return result;
  })();

  const payloadForStep = () => {
    switch (step) {
      case 1: return { name: form.name, age: parseInt(form.age, 10), gender: form.gender, phone: form.phone };
      case 2: return { sessionId, email: form.email, address: form.address, region: form.region };
      case 3: return {
        sessionId, dosha: form.dosha, dietary_habits: form.dietary_habits, weight_goal: form.weight_goal,
        height: parseFloat(form.height), weight: parseFloat(form.weight),
        condition: splitList(form.conditions), allergies: splitList(form.allergies),
      };
      case 4: return { sessionId, digestion: form.digestion, water_intake: form.water_intake, activity_level: form.activity_level, sleep_pattern: form.sleep_pattern };
      case 5: return { sessionId, stress_level: form.stress_level, work_type: form.work_type, cuisine_preference: form.cuisine_preference };
      default: return { sessionId, clinical_notes: form.clinical_notes, created_by: form.created_by };
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const result = await apiRequest(`/patient-registration/register/step${step}`, { method: 'POST', body: payloadForStep() });
      if (step === 1) setSessionId(result.sessionId);
      if (step === 6) {
        const { patient } = result.data;
        setStatus({ type: 'success', text: 'Patient registered. Opening their diet plan...' });
        setTimeout(() => navigate(`/diet-plans?patientId=${patient.id}&name=${encodeURIComponent(patient.name)}`), 1200);
        return;
      }
      setStep(step + 1);
    } catch (error) {
      setStatus({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setStatus(null);
    setStep(step - 1);
  };

  const summary = [
    ['Name', form.name], ['Age', form.age && `${form.age} years`], ['Gender', capitalize(form.gender)], ['Phone', form.phone],
    ['Dosha', form.dosha && formatDosha(form.dosha)], ['Diet', OPTIONS.dietary_habits.find(([v]) => v === form.dietary_habits)?.[1]],
    ['BMI', bmi], ['BMR', bmr && `${bmr} kcal/day`],
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="New patient" description="Register a patient to create their personalised Ayurvedic diet plan." />

      {/* Stepper */}
      <ol className="mb-6 hidden grid-cols-6 gap-2 sm:grid">
        {STEPS.map((s, index) => {
          const number = index + 1;
          const done = number < step;
          const current = number === step;
          return (
            <li key={s.title} className="flex flex-col gap-2">
              <span className={`h-1 rounded-full ${done || current ? 'bg-brand-500' : 'bg-ink-200'}`} />
              <span className={`flex items-center gap-1 text-xs font-medium ${current ? 'text-brand-700' : done ? 'text-ink-700' : 'text-ink-400'}`}>
                {done && <Check className="h-3.5 w-3.5" />}
                {s.title}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mb-6 sm:hidden">
        <div className="text-xs font-medium text-brand-700">Step {step} of {STEPS.length}</div>
        <div className="mt-2 h-1 rounded-full bg-ink-200">
          <div className="h-1 rounded-full bg-brand-500 transition-all" style={{ width: `${(step / STEPS.length) * 100}%` }} />
        </div>
      </div>

      <Card>
        <form onSubmit={handleNext}>
          <div className="border-b border-ink-200 px-6 py-4">
            <h2 className="text-base font-semibold text-ink-900">{STEPS[step - 1].title}</h2>
            <p className="text-sm text-ink-500">{STEPS[step - 1].description}</p>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
            {step === 1 && (
              <>
                <Field label="Full name" required><Input {...field('name')} autoComplete="off" placeholder="e.g. Asha Rao" /></Field>
                <Field label="Age" required><Input {...field('age')} type="number" min="1" max="120" placeholder="Years" /></Field>
                <Field label="Gender" required>{select('gender')}</Field>
                <Field label="Phone" required hint="10-digit mobile number"><Input {...field('phone')} type="tel" placeholder="98765 43210" /></Field>
              </>
            )}

            {step === 2 && (
              <>
                <Field label="Email"><Input {...field('email')} type="email" placeholder="name@example.com" /></Field>
                <Field label="Region">{select('region', null)}</Field>
                <Field label="Address" className="sm:col-span-2"><TextArea {...field('address')} rows={3} /></Field>
              </>
            )}

            {step === 3 && (
              <>
                <Field label="Dosha constitution" required>{select('dosha', 'Select dosha')}</Field>
                <Field label="Dietary preference">{select('dietary_habits', null)}</Field>
                <Field label="Height (cm)"><Input {...field('height')} type="number" min="50" max="300" /></Field>
                <Field label="Weight (kg)"><Input {...field('weight')} type="number" min="10" max="500" /></Field>
                <Field label="Weight goal" required>{select('weight_goal', null)}</Field>
                <div className="flex items-end gap-6 rounded-lg bg-ink-50 px-4 py-3 text-sm">
                  <div><div className="text-xs text-ink-500">BMI</div><div className="font-semibold tabular-nums text-ink-900">{bmi || '-'}</div></div>
                  <div><div className="text-xs text-ink-500">BMR</div><div className="font-semibold tabular-nums text-ink-900">{bmr ? `${bmr} kcal` : '-'}</div></div>
                </div>
                <Field label="Medical conditions" hint="Separate with commas" className="sm:col-span-2">
                  <Input {...field('conditions')} placeholder="e.g. acidity, thyroid" />
                </Field>
                <Field label="Allergies" hint="Separate with commas. Matching foods are left out of the plan." className="sm:col-span-2">
                  <Input {...field('allergies')} placeholder="e.g. peanuts, dairy" />
                </Field>
              </>
            )}

            {step === 4 && (
              <>
                <Field label="Digestion" required>{select('digestion')}</Field>
                <Field label="Daily water intake" required>{select('water_intake')}</Field>
                <Field label="Activity level" required>{select('activity_level')}</Field>
                <Field label="Sleep pattern" required>{select('sleep_pattern')}</Field>
              </>
            )}

            {step === 5 && (
              <>
                <Field label="Stress level" required>{select('stress_level')}</Field>
                <Field label="Work type" required>{select('work_type')}</Field>
                <Field label="Cuisine preference" required className="sm:col-span-2">{select('cuisine_preference')}</Field>
              </>
            )}

            {step === 6 && (
              <>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg bg-ink-50 p-4 text-sm sm:col-span-2 sm:grid-cols-4">
                  {summary.map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs text-ink-500">{label}</dt>
                      <dd className="font-medium text-ink-900">{value || '-'}</dd>
                    </div>
                  ))}
                </dl>
                <Field label="Clinical notes" className="sm:col-span-2">
                  <TextArea {...field('clinical_notes')} rows={4} placeholder="Anything the plan should take into account" />
                </Field>
                <Field label="Practitioner" required><Input {...field('created_by')} /></Field>
              </>
            )}
          </div>

          <div className="px-6"><Notice status={status} /></div>

          <div className="flex items-center justify-between gap-3 border-t border-ink-200 px-6 py-4 mt-6">
            <Button variant="ghost" icon={ArrowLeft} onClick={handleBack} disabled={step === 1 || submitting}>
              Back
            </Button>
            <Button type="submit" loading={submitting}>
              {step === STEPS.length ? 'Register patient' : 'Continue'}
              {!submitting && step < STEPS.length && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PatientRegistration;
