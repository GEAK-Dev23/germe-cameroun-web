"use client";

import { use } from "react";
import { testsModuleApi } from "@/lib/api";
import TestQcmRunner from "@/components/plateforme/TestQcmRunner";

export default function TestModulePage({
  params,
}: {
  params: Promise<{ id: string; moduleId: string }>;
}) {
  const { id, moduleId } = use(params);

  return (
    <TestQcmRunner
      obtenirTest={() => testsModuleApi.obtenirPourApprenant(moduleId)}
      soumettreTest={(testId, reponses) =>
        testsModuleApi.soumettre(testId, reponses)
      }
      retourHref={`/plateforme/formations/${id}`}
      succesHref={`/plateforme/formations/${id}`}
      succesLabel="Retour à la formation"
    />
  );
}
