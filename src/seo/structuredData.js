export function generateStructuredData() {
  const baseUrl = 'https://jansahayak-ai.netlify.app';

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "JanSahayak AI",
    url: baseUrl,
    description:
      "JanSahayak AI is a smart constituency development planner and MP command center that bridges citizens and administrators through multilingual AI grievance filing, spatial analytics, and budget optimization.",
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "JanSahayak AI",
      logo: `${baseUrl}/favicon.svg`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "JanSahayak AI",
    applicationCategory: "GovernmentApplication",
    operatingSystem: "Web",
    description:
      "AI-powered constituency development planner with multilingual voice grievances, GIS command center, and budget resource optimizer for Members of Parliament.",
    url: baseUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    author: {
      "@type": "Organization",
      name: "Team JanSahayak",
    },
  };

  return [website, softwareApp];
}

export function injectStructuredData() {
  const schemas = generateStructuredData();
  schemas.forEach((s) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(s);
    document.head.appendChild(script);
  });
}