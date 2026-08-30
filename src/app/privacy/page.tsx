"use client";

import React from "react";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content: [
      "**Account information:** Name, email address, phone number, and profile photo when you register.",
      "**Location data:** Precise GPS location when the app is active to match you with nearby drivers and calculate routes.",
      "**Trip data:** Pick-up and drop-off locations, route taken, duration, and fare for every completed ride.",
      "**Payment information:** Credit/debit card details processed securely via our payment provider. We do not store full card numbers.",
      "**Device information:** Device model, operating system, unique device identifiers, and IP address.",
      "**Communications:** Messages exchanged with drivers, support agents, or through the in-app chat.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "**Provide the service:** Match you with available drivers, calculate fares, process payments, and send receipts.",
      "**Safety & security:** Verify identities, detect fraud, investigate incidents, and operate the SOS and live-tracking features.",
      "**Service improvements:** Analyze usage patterns, optimize matching algorithms, and develop new features.",
      "**Communications:** Send trip confirmations, receipts, support responses, and (with consent) promotional offers.",
      "**Legal compliance:** Meet our obligations under applicable law, including tax reporting and regulatory requirements.",
    ],
  },
  {
    title: "3. Sharing Your Information",
    content: [
      "**With drivers:** Your name, profile photo, pick-up location, and destination are shared with your assigned driver.",
      "**With service providers:** We share data with trusted third parties (payment processors, cloud hosting, analytics) under strict confidentiality agreements.",
      "**Legal requirements:** We may disclose information when required by law, court order, or to protect the safety of users.",
      "**Business transfers:** In the event of a merger, acquisition, or sale of assets, user data may be transferred to the acquiring entity.",
      "We do **not** sell your personal data to third parties for marketing purposes.",
    ],
  },
  {
    title: "4. Data Retention",
    content: [
      "We retain your account data for as long as your account is active or as needed to provide services.",
      "Trip history is retained for up to 7 years for legal and tax compliance purposes.",
      "You may request deletion of your account and associated data at any time (see Section 6).",
    ],
  },
  {
    title: "5. Cookies & Tracking",
    content: [
      "We use cookies and similar tracking technologies to operate the website, remember your preferences, and analyze traffic.",
      "**Essential cookies:** Required for the website to function. Cannot be disabled.",
      "**Analytics cookies:** Help us understand how visitors interact with our site (e.g., Google Analytics).",
      "**Marketing cookies:** Used to deliver relevant advertisements (only with your consent).",
      "You can manage your cookie preferences at any time through the cookie banner or your browser settings.",
    ],
  },
  {
    title: "6. Your Rights",
    content: [
      "**Access:** Request a copy of the personal data we hold about you.",
      "**Correction:** Ask us to correct inaccurate or incomplete information.",
      "**Deletion:** Request deletion of your account and personal data.",
      "**Portability:** Receive your data in a structured, machine-readable format.",
      "**Opt-out:** Unsubscribe from marketing communications at any time via the link in any email.",
      "To exercise any of these rights, contact us at privacy@urbont.app.",
    ],
  },
  {
    title: "7. Data Security",
    content: [
      "We use industry-standard encryption (TLS/SSL) for all data in transit and AES-256 encryption for data at rest.",
      "Access to personal data is restricted to authorized personnel on a need-to-know basis.",
      "We conduct regular security audits and penetration tests.",
      "In the event of a data breach affecting your rights, we will notify you as required by applicable law.",
    ],
  },
  {
    title: "8. Children's Privacy",
    content: [
      "Urbont services are not directed to individuals under the age of 18.",
      "We do not knowingly collect personal data from minors. If you believe a minor has provided us data, please contact privacy@urbont.app and we will delete it promptly.",
    ],
  },
  {
    title: "9. International Transfers",
    content: [
      "Urbont operates in the United States. If you use our services from outside the US, your data may be transferred to and processed in the United States.",
      "We apply appropriate safeguards, including standard contractual clauses, to protect data transferred internationally.",
    ],
  },
  {
    title: "10. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. We will notify you of material changes via email or in-app notification at least 30 days before they take effect.",
      "Continued use of our services after the effective date constitutes acceptance of the updated policy.",
    ],
  },
  {
    title: "11. Contact Us",
    content: [
      "**Urbont Technologies Inc.**",
      "Privacy Department",
      "Miami, Florida, United States",
      "Email: privacy@urbont.app",
      "For urgent privacy matters, please include 'PRIVACY REQUEST' in the subject line.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/urbont-logo.png" alt="Urbont" className="h-8 w-8 object-contain rounded-lg" />
            <span className="text-lg font-extrabold tracking-tight text-gray-900">Urbont</span>
          </a>
          <a href="/">
            <Button variant="ghost" className="gap-2 text-sm font-semibold text-gray-600">
              <ArrowLeft size={16} />
              Back to home
            </Button>
          </a>
        </div>
      </header>

      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-5">
              <Shield size={14} />
              Legal
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-500 text-base">
              Last updated: <strong>May 26, 2026</strong> — Effective: <strong>June 1, 2026</strong>
            </p>
            <p className="text-gray-600 mt-4 leading-relaxed">
              Urbont Technologies Inc. ("Urbont", "we", "us", or "our") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, share, and protect information about you when
              you use the Urbont mobile application and website (the "Service").
            </p>
          </div>

          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.content.map((item, i) => (
                    <li key={i} className="text-gray-600 leading-relaxed text-sm">
                      {item.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                        j % 2 === 1
                          ? <strong key={j} className="font-semibold text-gray-800">{part}</strong>
                          : part
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-16 p-6 bg-primary/5 rounded-2xl border border-primary/20">
            <p className="text-sm text-gray-600 leading-relaxed">
              By using Urbont, you acknowledge that you have read and understood this Privacy Policy.
              If you have any questions, contact us at{" "}
              <a href="mailto:privacy@urbont.app" className="text-primary font-semibold hover:underline">
                privacy@urbont.app
              </a>.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Urbont Technologies Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="text-primary font-semibold">Privacy Policy</a>
            <a href="/terms" className="hover:text-gray-600 font-medium transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
