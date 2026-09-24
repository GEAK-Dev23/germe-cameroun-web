/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxifie /api/* vers l'API NestJS réelle. Indispensable en production
  // (Vercel + Render, deux domaines distincts) : sans ce rewrite, un cookie
  // posé par l'API lors de la connexion est scellé sur le domaine de
  // l'API (onrender.com) et n'est donc jamais envoyé par le navigateur au
  // frontend (vercel.app) — le middleware d'authentification (proxy.ts) ne
  // le voit alors jamais, et le clic sur « Se connecter » ne redirige nulle
  // part. En passant par ce rewrite, le navigateur ne parle qu'au domaine
  // du frontend ; le cookie est donc posé sur CE domaine, lisible par le
  // middleware. Voir API_INTERNAL_URL dans .env.example.
  async rewrites() {
    const cible = process.env.API_INTERNAL_URL ?? "http://localhost:3001/api";
    return [
      {
        source: "/api/:chemin*",
        destination: `${cible}/:chemin*`,
      },
    ];
  },
};

module.exports = nextConfig;
