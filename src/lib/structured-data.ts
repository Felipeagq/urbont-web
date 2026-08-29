/**
 * Datos estructurados (schema.org) del sitio.
 *
 * Portado literalmente del <script type="application/ld+json"> que vivía en
 * index.html. Se inyecta desde app/layout.tsx. No tocar sin revisar el impacto
 * en SEO: describe la organización, el sitio, la app móvil y el FAQ.
 */
export const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://urbont.com/#organization",
        "name": "Urbont",
        "url": "https://urbont.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://urbont.com/urbont-logo.png",
          "width": 512,
          "height": 512
        },
        "description": "Urbont is a ridesharing and mobility platform connecting passengers with verified drivers across Miami and Florida.",
        "sameAs": [
          "https://www.facebook.com/urbontapp",
          "https://www.instagram.com/urbontapp",
          "https://twitter.com/urbontapp",
          "https://www.tiktok.com/@urbontapp"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "availableLanguage": [
            "English",
            "Spanish",
            "Chinese",
            "French",
            "Portuguese"
          ]
        },
        "areaServed": [
          {
            "@type": "City",
            "name": "Miami",
            "containedInPlace": {
              "@type": "State",
              "name": "Florida"
            }
          },
          {
            "@type": "City",
            "name": "Orlando",
            "containedInPlace": {
              "@type": "State",
              "name": "Florida"
            }
          },
          {
            "@type": "City",
            "name": "Tampa",
            "containedInPlace": {
              "@type": "State",
              "name": "Florida"
            }
          },
          {
            "@type": "City",
            "name": "Houston",
            "containedInPlace": {
              "@type": "State",
              "name": "Texas"
            }
          },
          {
            "@type": "City",
            "name": "Dallas",
            "containedInPlace": {
              "@type": "State",
              "name": "Texas"
            }
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://urbont.com/#website",
        "url": "https://urbont.com",
        "name": "Urbont",
        "publisher": {
          "@id": "https://urbont.com/#organization"
        },
        "inLanguage": [
          "en",
          "es",
          "zh",
          "fr",
          "pt"
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://urbont.com/#webpage",
        "url": "https://urbont.com",
        "name": "Urbont — Safe, Affordable Ridesharing in Miami & Florida",
        "description": "Fast, safe rides at fair prices in Miami. Drivers keep 85% — the most competitive commission on the market.",
        "isPartOf": {
          "@id": "https://urbont.com/#website"
        },
        "about": {
          "@id": "https://urbont.com/#organization"
        },
        "inLanguage": "en"
      },
      {
        "@type": "MobileApplication",
        "name": "Urbont",
        "operatingSystem": "iOS, Android",
        "applicationCategory": "TravelApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Safe ridesharing app for Miami and Florida. Request rides, track drivers in real time, and pay digitally.",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "10000",
          "bestRating": "5"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does Urbont work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Download the app, create your account in minutes and request a ride. Our AI algorithm connects you with the nearest verified driver in real time. You pay digitally on arrival."
            }
          },
          {
            "@type": "Question",
            "name": "Which cities does Urbont operate in?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Currently operating in Miami, FL. Expanding to Orlando, Tampa, Fort Lauderdale, Houston and Dallas."
            }
          },
          {
            "@type": "Question",
            "name": "What is Urbont's driver commission?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Urbont charges only 15% commission — the lowest in the market. Drivers keep 85% of every ride."
            }
          },
          {
            "@type": "Question",
            "name": "Is it safe to ride with Urbont?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. All drivers go through in-person identity verification, driving test and criminal background check. Every ride includes live tracking and an SOS button."
            }
          }
        ]
      }
    ]
  } as const;
