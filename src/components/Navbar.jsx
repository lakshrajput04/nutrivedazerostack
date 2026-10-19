import { Link, NavLink } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
  }`;

const Navbar = () => (
  <header className="sticky top-0 z-20 border-b border-ink-200 bg-white/90 backdrop-blur">
    <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-6 sm:px-6">
      <Link to="/" className="flex flex-shrink-0 items-center gap-2">
        <img src="/nutriveda-logo.png" alt="" className="h-8 w-8 rounded-full" />
        <span className="hidden text-base font-semibold text-ink-900 sm:inline">NutriVeda</span>
      </Link>

      <nav className="flex items-center gap-1">
        <NavLink to="/" end className={navLinkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/patients" end className={navLinkClass}>
          Patients
        </NavLink>
      </nav>

      <Link
        to="/patients/register"
        className="ml-auto inline-flex h-9 items-center gap-2 rounded-lg bg-brand-600 px-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
      >
        <UserPlus className="h-4 w-4" />
        <span className="hidden sm:inline">New patient</span>
      </Link>
    </div>
  </header>
);

export default Navbar;
