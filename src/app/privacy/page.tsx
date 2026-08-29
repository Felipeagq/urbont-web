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
        "**SMS/text messaging:** Send transactional text messages related to your trip activity, account security, and (only with explicit consent) promotional offers. See Section 3 for full SMS terms.",
        "**Legal compliance:** Meet our obligations under applicable law, including tax reporting and regulatory requirements.",
      ],
    },
    {
      title: "3. SMS & Text Messaging",
      content: [
        "Urbont Technologies Inc. operates an SMS messaging program to communicate with users who have provided their mobile phone number. By providing your phone number during registration or through any Urbont signup form, you expressly consent to receive text messages from Urbont as described in this section.",
        "**Program name:** Urbont Notifications",
        "**Types of messages we send:**",
        "• Transactional messages: trip confirmations, driver arrival alerts, ride status updates, OTP/verification codes, payment receipts, and account security alerts.",
        "• Safety messages: real-time safety notifications, SOS acknowledgments, and emergency-related communications.",
        "• Service messages: important account changes, scheduled maintenance, and policy update notices.",
        "• Promotional messages (with explicit opt-in only): special offers, new feature announcements, and market launch updates — sent only to users who have separately opted in to marketing communications.",
        "**Message frequency:** Transactional and safety messages are sent as events occur (e.g., one message per trip action). Promotional messages, if opted into, are sent no more than 4 times per month.",
        "**Message and data rates:** Standard message and data rates from your wireless carrier may apply. Urbont does not charge for SMS messages; carrier charges may apply.",
        "**How to opt in:** You consent to transactional SMS by providing your phone number and agreeing to our Terms of Service during account creation. Promotional SMS requires a separate, explicit opt-in.",
        "**How to opt out:** Reply STOP to any Urbont text message to cancel promotional messages. You will receive one final confirmation message. To stop all non-critical SMS, email privacy@urbont.com with subject 'SMS OPT-OUT'. Opting out of promotional messages does not affect transactional or safety SMS required to deliver the Service.",
        "**How to get help:** Reply HELP to any message or contact privacy@urbont.com.",
        "**No sharing of SMS data:** No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. All categories of data described in this Privacy Policy exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties. Your phone number and SMS consent are used solely to deliver the messages described above.",
        "**SMS service provider:** We use Twilio, a third-party SMS delivery provider, to transmit messages on our behalf. Twilio acts as a data processor under a written data processing agreement and is prohibited from using your phone number or message content for its own marketing.",
        "**Supported carriers:** Urbont SMS is supported by all major US wireless carriers including AT&T, T-Mobile, Verizon, Sprint, and others. Carrier support may vary.",
      ],
    },
    {
      title: "4. Sharing Your Information",
      content: [
        "**With drivers:** Your name, profile photo, pick-up location, and destination are shared with your assigned driver.",
        "**With service providers:** We share data with trusted third parties (payment processors, cloud hosting, analytics providers, and SMS delivery providers such as Twilio) under strict confidentiality and data processing agreements.",
        "**Legal requirements:** We may disclose information when required by law, court order, or to protect the safety of users.",
        "**Business transfers:** In the event of a merger, acquisition, or sale of assets, user data may be transferred to the acquiring entity.",
        "We do **not** sell your personal data to third parties for marketing purposes.",
        "We do **not** share your phone number or SMS opt-in consent with third parties or affiliates for marketing or promotional purposes.",
      ],
    },
    {
      title: "5. Data Retention",
      content: [
        "We retain your account data for as long as your account is active or as needed to provide services.",
        "Trip history is retained for up to 7 years for legal and tax compliance purposes.",
        "SMS opt-in and opt-out records are retained for a minimum of 4 years as required by applicable telecommunications regulations.",
        "You may request deletion of your account and associated data at any time (see Section 7).",
      ],
    },
    {
      title: "6. Cookies & Tracking",
      content: [
        "We use cookies and similar tracking technologies to operate the website, remember your preferences, and analyze traffic.",
        "**Essential cookies:** Required for the website to function. Cannot be disabled.",
        "**Analytics cookies:** Help us understand how visitors interact with our site (e.g., Google Analytics).",
        "**Marketing cookies:** Used to deliver relevant advertisements (only with your consent).",
        "You can manage your cookie preferences at any time through the cookie banner or your browser settings.",
      ],
    },
    {
      title: "7. Your Rights",
      content: [
        "**Access:** Request a copy of the personal data we hold about you.",
        "**Correction:** Ask us to correct inaccurate or incomplete information.",
        "**Deletion:** Request deletion of your account and personal data, subject to applicable legal retention requirements.",
        "**Portability:** Receive your data in a structured, machine-readable format.",
        "**Opt-out of marketing email:** Unsubscribe from marketing emails at any time via the link in any email.",
        "**Opt-out of promotional SMS:** Reply STOP to any promotional text message, or email privacy@urbont.com with subject 'SMS OPT-OUT'.",
        "To exercise any of these rights, contact us at privacy@urbont.com.",
      ],
    },
    {
      title: "8. Data Security",
      content: [
        "We use industry-standard encryption (TLS/SSL) for all data in transit and AES-256 encryption for data at rest.",
        "Access to personal data is restricted to authorized personnel on a need-to-know basis.",
        "We conduct regular security audits and penetration tests.",
        "In the event of a data breach affecting your rights, we will notify you as required by applicable law.",
      ],
    },
    {
      title: "9. Children's Privacy",
      content: [
        "Urbont services are not directed to individuals under the age of 18.",
        "We do not knowingly collect personal data from minors. If you believe a minor has provided us data, please contact privacy@urbont.com and we will delete it promptly.",
      ],
    },
    {
      title: "10. International Transfers",
      content: [
        "Urbont operates in the United States. If you use our services from outside the US, your data may be transferred to and processed in the United States.",
        "We apply appropriate safeguards, including standard contractual clauses, to protect data transferred internationally.",
      ],
    },
    {
      title: "11. Changes to This Policy",
      content: [
        "We may update this Privacy Policy from time to time. We will notify you of material changes via email or in-app notification at least 30 days before they take effect.",
        "Continued use of our services after the effective date constitutes acceptance of the updated policy.",
      ],
    },
    {
      title: "12. Contact Us",
      content: [
        "**Urbont Technologies Inc.**",
        "Privacy Department",
        "Miami, Florida, United States",
        "Email: privacy@urbont.com",
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
                Last updated: <strong>June 7, 2026</strong> — Effective: <strong>June 7, 2026</strong>
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
                <a href="mailto:privacy@urbont.com" className="text-primary font-semibold hover:underline">
                  privacy@urbont.com
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
  