"use client";

import Link from "next/link";
import { LayoutDashboard, Users, Stethoscope, Calendar, FileText, CreditCard, Pill, FlaskRound } from "lucide-react";

const nav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Doctors", href: "/doctors", icon: Stethoscope },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Medical Records", href: "/records", icon: FileText },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Pharmacy", href: "/pharmacy", icon: Pill },
  { name: "Lab", href: "/lab", icon: FlaskRound }
];

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white shadow-md p-4 fixed left-0 top-0">
      <h1 className="text-xl font-bold mb-6">🏥 HMS</h1>
      <nav className="flex flex-col gap-2">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
          >
            <item.icon size={20} />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
