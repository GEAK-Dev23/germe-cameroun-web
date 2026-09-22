"use client";

import { use } from "react";
import { examenFinalApi } from "@/lib/api";
import TestQcmRunner from "@/components/plateforme/TestQcmRunner";

// Examen final de la FORMATION ENTIÈRE (distinct du test de fin de
// module) : dernier verrou avant de pouvoir générer l'attestation, une
// fois tous les modules de la formation validés.
export default function TestFinalFormationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <TestQcmRunner
      obtenirTest={() => examenFinalApi.obtenirPourApprenant(id)}
      soumettreTest={(testId, reponses) =>
        examenFinalApi.soumettre(testId, reponses)
      }
      retourHref={`/plateforme/formations/${id}`}
      succesHref={`/plateforme/formations/${id}/attestation`}
      succesLabel="Générer mon attestation"
    />
  );
}
