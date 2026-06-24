import { Phone } from "lucide-react";
import { emergencyContacts } from "@/lib/travel-data";

const toneClass = {
  red: "bg-red-50 text-red-600",
  blue: "bg-blue-50 text-blue-700",
  dark: "bg-neutral-100 text-neutral-950",
};

export default function EmergencyCard() {
  return (
    <section className="rounded-[28px] border border-neutral-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-neutral-950">緊急聯絡</h2>
        <span className="text-sm font-semibold text-neutral-500">Emergency</span>
      </div>

      <div className="mt-6 grid grid-cols-1 divide-y divide-neutral-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {emergencyContacts.map((contact) => (
          <a
            key={contact.href}
            className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 sm:flex-col sm:justify-center sm:px-4 sm:py-0 sm:text-center"
            href={contact.href}
          >
            <span
              className={`inline-flex h-10 min-w-16 items-center justify-center rounded-full px-4 text-base font-bold ${toneClass[contact.tone]}`}
            >
              {contact.tone === "dark" ? <Phone size={20} fill="currentColor" /> : contact.value}
            </span>

            <span>
              <span className="block text-sm font-bold text-neutral-950">
                {contact.label}
              </span>
              {contact.tone === "dark" && (
                <span className="mt-1 block text-sm font-semibold text-neutral-600">
                  {contact.value}
                </span>
              )}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
