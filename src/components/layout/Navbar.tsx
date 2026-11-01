import Link from "next/link";
import { Compass, ShieldCheck, ArrowRight, Lock } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-steel-200">
      {/* Top Engineering Compliance & Location Bar */}
      <div className="bg-navy-950 text-steel-400 text-xs py-2 px-6 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-steel-300">
              <Compass className="w-3.5 h-3.5 text-blueprint-500" />
              <span>MEP Engineering Consultancy • Kolkata HQ</span>
            </span>
            <span className="hidden sm:inline text-steel-600">|</span>
            <span className="hidden sm:inline">Standards: NBC 2016 • ASHRAE 90.1/170 • ECBC</span>
          </div>
          <div className="flex items-center gap-4 text-steel-300">
            <span>Direct Advisory: +91 98363 44430</span>
            <span className="text-steel-600">|</span>
            <Link href="/auth/login" className="flex items-center gap-1 text-white hover:text-blueprint-400 font-medium transition-colors">
              <Lock className="w-3 h-3 text-blueprint-400" />
              <span>Secure Client & Staff Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Corporate Navigation */}
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-navy-900 border border-navy-700 flex items-center justify-center text-white font-bold tracking-wider text-lg rounded-sm">
            AT
          </div>
          <div>
            <div className="font-bold text-xl tracking-tight text-navy-900 leading-none">
              AIRTECH
            </div>
            <div className="text-[10px] font-semibold text-steel-500 tracking-widest uppercase mt-1">
              HVAC & MEP Engineering
            </div>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-steel-700">
          <Link href="/#services" className="hover:text-navy-900 transition-colors">
            Engineering Disciplines
          </Link>
          <Link href="/#standards" className="hover:text-navy-900 transition-colors">
            Codes & Standards
          </Link>
          <Link href="/#projects" className="hover:text-navy-900 transition-colors">
            Projects Portfolio
          </Link>
          <Link href="/#careers" className="hover:text-navy-900 transition-colors">
            Careers
          </Link>
          <Link href="/#contact" className="hover:text-navy-900 transition-colors">
            Contact
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-colors border border-navy-950 shadow-subtle"
          >
            <span>Portals Access</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
