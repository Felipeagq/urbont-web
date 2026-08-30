"use client";

import React from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: [
      "By downloading, installing, or using the Urbont application or website, you agree to be bound by these Terms of Service ('Terms'). If you do not agree, do not use our services.",
      "These Terms apply to all users of the Service, including passengers, drivers, and enterprise customers.",
      "Urbont reserves the right to update these Terms at any time. Continued use after changes constitutes acceptance.",
    ],
  },
  {
    title: "2. Description of Service",
    content: [
      "Urbont is a technology platform that connects passengers seeking transportation with independent driver-partners. Urbont does not provide transportation services directly.",
      "Drivers using the Urbont platform are independent contractors, not employees, agents, or partners of Urbont.",
      "We reserve the right to modify, suspend, or discontinue any part of the Service at any time.",
    ],
  },
  {
    title: "3. User Accounts",
    content: [
      "You must be at least 18 years of age to create an account and use the Service.",
      "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
      "You agree to provide accurate, current, and complete information during registration and to update it as necessary.",
      "Urbont reserves the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.",
    ],
  },
  {
    title: "4. Passenger Terms",
    content: [
      "**Ride requests:** When you request a ride, you are making an offer to hire an independent driver. The ride begins when a driver accepts your request.",
      "**Fares:** Fares are calculated based on distance, time, and demand. The estimated fare is shown before you confirm. Final fares may differ due to route changes or waiting time.",
      "**Cancellations:** Cancellations made after the driver is en route may incur a cancellation fee as displayed in the app.",
      "**Conduct:** You agree to treat drivers respectfully. Abusive behavior, property damage, or violation of our Community Guidelines may result in account suspension.",
      "**Lost items:** Urbont is not liable for items left in vehicles. We will assist in connecting you with the driver to recover lost items.",
    ],
  },
  {
    title: "5. Driver Terms",
    content: [
      "**Eligibility:** To drive with Urbont, you must hold a valid driver's license, maintain required insurance, pass our background check and in-person verification.",
      "**Independent contractor:** You acknowledge that you are an independent contractor operating your own business, not an employee of Urbont.",
      "**Vehicle standards:** Your vehicle must meet Urbont's minimum requirements for safety, cleanliness, and year of manufacture.",
      "**Earnings:** Urbont charges a 15% commission on each completed fare. The remainder is paid to you weekly via direct deposit.",
      "**Conduct:** You agree to maintain professional conduct, follow traffic laws, and comply with all applicable regulations.",
    ],
  },
  {
    title: "6. Payments",
    content: [
      "All payments are processed digitally through Urbont's payment system. We accept major credit/debit cards, Apple Pay, and Google Pay.",
      "By providing payment information, you authorize Urbont to charge the applicable fare plus any applicable fees.",
      "Receipts are sent automatically to your registered email after each trip.",
      "Disputed charges must be reported within 30 days of the transaction via the app's support feature.",
    ],
  },
  {
    title: "7. Prohibited Activities",
    content: [
      "Using the Service for any unlawful purpose or in violation of any applicable laws or regulations.",
      "Harassment, discrimination, or threatening behavior toward drivers, passengers, or Urbont employees.",
      "Fraudulent use of promotions, referral codes, or payment methods.",
      "Attempting to reverse-engineer, hack, or disrupt the Urbont platform or its underlying technology.",
      "Using the Service to transport illegal substances or engage in any criminal activity.",
      "Creating multiple accounts to circumvent suspensions or bans.",
    ],
  },
  {
    title: "8. Limitation of Liability",
    content: [
      "To the maximum extent permitted by law, Urbont shall not be liable for any indirect, incidental, special, consequential, or punitive damages.",
      "Urbont's total liability for any claim arising from or relating to the Service shall not exceed the greater of (a) $100 USD or (b) the amount you paid to Urbont in the 3 months preceding the claim.",
      "Urbont does not guarantee the availability, accuracy, or reliability of the Service at any given time.",
    ],
  },
  {
    title: "9. Indemnification",
    content: [
      "You agree to indemnify, defend, and hold harmless Urbont, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.",
    ],
  },
  {
    title: "10. Dispute Resolution",
    content: [
      "Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in Miami, Florida, under the rules of the American Arbitration Association.",
      "You waive any right to participate in a class action lawsuit or class-wide arbitration against Urbont.",
      "Notwithstanding the above, either party may seek injunctive relief in a court of competent jurisdiction.",
    ],
  },
  {
    title: "11. Governing Law",
    content: [
      "These Terms are governed by the laws of the State of Florida, United States, without regard to conflict-of-law principles.",
      "You consent to exclusive jurisdiction and venue in the state and federal courts located in Miami-Dade County, Florida.",
    ],
  },
  {
    title: "12. Contact",
    content: [
      "**Urbont Technologies Inc.**",
      "Legal Department",
      "Miami, Florida, United States",
      "Email: legal@urbont.app",
    ],
  },
];

export default function Terms() {
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
              <FileText size={14} />
              Legal
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-500 text-base">
              Last updated: <strong>May 26, 2026</strong> — Effective: <strong>June 1, 2026</strong>
            </p>
            <p className="text-gray-600 mt-4 leading-relaxed">
              Please read these Terms of Service carefully before using the Urbont platform. These Terms
              constitute a legally binding agreement between you and Urbont Technologies Inc.
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
              By using Urbont, you agree to these Terms. For questions, contact us at{" "}
              <a href="mailto:legal@urbont.app" className="text-primary font-semibold hover:underline">
                legal@urbont.app
              </a>.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Urbont Technologies Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-gray-600 font-medium transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-primary font-semibold">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
