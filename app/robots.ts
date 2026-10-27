import type { MetadataRoute } from "next";

// Adresse publique du site (celle que Google affiche : avec "www").
const SITE_URL = "https://www.germecameroune.org";

// Indique aux moteurs de recherche ce qu'ils peuvent explorer. Les espaces
// privés (plateforme d'apprentissage, administration, vérification de
// certificats) ne doivent pas apparaître dans Google.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/plateforme", "/verifier"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
