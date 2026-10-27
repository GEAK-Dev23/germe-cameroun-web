import type { MetadataRoute } from "next";

// Adresse publique du site (celle que Google affiche : avec "www").
const SITE_URL = "https://www.germecameroune.org";

// Liste des pages publiques à faire connaître à Google. Si une nouvelle
// page publique est ajoutée au site, l'ajouter ici.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/signup`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
