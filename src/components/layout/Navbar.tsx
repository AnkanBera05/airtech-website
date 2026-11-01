"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, ShieldCheck, ArrowRight, Lock, Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Leadership", href: "/leadership" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-steel-200">
      {/* Top Engineering Compliance & Location Bar */}
      <div className="bg-navy-950 text-steel-400 text-xs py-2 px-6 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-steel-300">
              <Compass className="w-3.5 h-3.5 text-blueprint-400" />
              <span>MEP Engineering Consultancy • Kolkata HQ</span>
            </span>
            <span className="hidden sm:inline text-steel-600">|</span>
            <span className="hidden sm:inline">Codes: NBC 2016 • ASHRAE 90.1/170 • ISHRAE • ECBC</span>
          </div>
          <div className="flex items-center gap-4 text-steel-300">
            <span>Direct Advisory: +91 98363 44430</span>
            <span className="text-steel-600">|</span>
            <Link
              href="/portal-access"
              className="flex items-center gap-1 text-white hover:text-blueprint-400 font-medium transition-colors"
            >
              <Lock className="w-3 h-3 text-blueprint-400" />
              <span>Portals Access (Owner • Staff • Client)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Corporate Navigation (Matching Panels 1-7) */}
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo (▲ AIRTECH) */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-2xl text-navy-950 font-black">▲</span>
          <div>
            <div className="font-extrabold text-xl tracking-tight text-navy-950 leading-none">
              AIRTECH
            </div>
            <div className="text-[9px] font-bold text-steel-500 tracking-widest uppercase mt-1">
              HVAC & MEP Engineering
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-steel-700">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 border-b-2 ${
                  isActive
                    ? "text-navy-950 font-bold border-airtech-blue"
                    : "text-steel-600 hover:text-navy-950 border-transparent hover:border-steel-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/portal-access"
            className="hidden sm:inline-flex items-center gap-2 bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-colors border border-navy-950 shadow-subtle"
          >
            <span>Portal Access</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-steel-700 hover:text-navy-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-steel-200 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-steel-800 hover:text-navy-950 py-2 border-b border-steel-100"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/portal-access"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 bg-navy-950 text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-sm"
            >
              <span>Portal Access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
