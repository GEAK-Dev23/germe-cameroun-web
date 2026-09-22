"use client";

import { use } from "react";
import { testsChapitreApi } from "@/lib/api";
import TestQcmRunner from "@/components/plateforme/TestQcmRunner";

export default function TestChapitrePage({
  params,
}: {
  params: Promise<{ id: string; chapitreId: string }>;
}) {
  const { id, chapitreId } = use(params);

  return (
    <TestQcmRunner
      obtenirTest={() => testsChapitreApi.obtenirPourApprenant(chapitreId)}
      soumettreTest={(testId, reponses) =>
        testsChapitreApi.soumettre(testId, reponses)
      }
      retourHref={`/plateforme/formations/${id}`}
      succesHref={`/plateforme/formations/${id}`}
      succesLabel="Retour à la formation"
    />
  );
}
