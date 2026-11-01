import Link from "next/link";
import { Compass, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-steel-400 text-sm border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Company Profile */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-navy-800 border border-navy-700 flex items-center justify-center text-white font-bold text-base rounded-sm">
                AT
              </div>
              <div>
                <div className="font-bold text-lg text-white tracking-tight">AIRTECH</div>
                <div className="text-[10px] text-steel-400 tracking-wider uppercase">MEP Engineering Consultancy</div>
              </div>
            </div>
            <p className="text-xs text-steel-400 leading-relaxed mb-6">
              Independent technical consultancy delivering specialized HVAC, Fire Fighting, Electrical, Plumbing and Building Management System design across Eastern India.
            </p>
            <div className="text-xs text-steel-400 space-y-1">
              <div>GSTIN: 19AABCA1234F1Z5</div>
              <div>HSN / SAC Code: 998333 (Engineering Advisory)</div>
            </div>
          </div>

          {/* Column 2: Engineering Disciplines */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Disciplines
            </div>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/#services" className="hover:text-white transition-colors">HVAC & Cleanroom Engineering</Link></li>
              <li><Link href="/#services" className="hover:text-white transition-colors">Fire Protection & Hydrant Systems</Link></li>
              <li><Link href="/#services" className="hover:text-white transition-colors">Electrical Substation & Distribution</Link></li>
              <li><Link href="/#services" className="hover:text-white transition-colors">Public Health & Plumbing (PHE)</Link></li>
              <li><Link href="/#services" className="hover:text-white transition-colors">Building Management Systems (IBMS)</Link></li>
              <li><Link href="/#services" className="hover:text-white transition-colors">Energy Modeling & ECBC Compliance</Link></li>
            </ul>
          </div>

          {/* Column 3: Secure Portals */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Enterprise Portals
            </div>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Client Project Portal & Drawings</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Online Invoice Payment (Stripe / Bank)</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Project Manager Workspace</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Finance & Billing Management</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Employee Timesheets & Tasks</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Administrator Console</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Kolkata Office */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Registered Office
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blueprint-400 shrink-0 mt-0.5" />
                <span>Rajarhat Gopalpur, Kolkata - 700136, West Bengal, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blueprint-400 shrink-0" />
                <span>+91 98363 44430</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blueprint-400 shrink-0" />
                <span>contact@airtech-mep.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 border-t border-navy-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-steel-500">
          <div>
            &copy; {new Date().getFullYear()} AIRTECH Engineering Consultancy. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Powered by Supabase & Stripe (India Compliant)</span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-steel-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Row Level Security Enforced</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
