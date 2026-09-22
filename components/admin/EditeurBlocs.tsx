"use client";

import { type BlocContenu } from "@/lib/api";
import EditeurTexteEnrichi from "./EditeurTexteEnrichi";
import ChampMedia from "./ChampMedia";

function idBloc(): string {
  return `bloc-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

export default function EditeurBlocs({
  blocs,
  setBlocs,
}: {
  blocs: BlocContenu[];
  setBlocs: (b: BlocContenu[]) => void;
}) {
  function ajouter(type: BlocContenu["type"]) {
    if (type === "texte") {
      setBlocs([...blocs, { id: idBloc(), type: "texte", texte: "" }]);
    } else {
      setBlocs([...blocs, { id: idBloc(), type, url: "", legende: "" }]);
    }
  }

  function retirer(index: number) {
    setBlocs(blocs.filter((_, i) => i !== index));
  }

  function deplacer(index: number, direction: -1 | 1) {
    const cible = index + direction;
    if (cible < 0 || cible >= blocs.length) return;
    const copie = [...blocs];
    [copie[index], copie[cible]] = [copie[cible], copie[index]];
    setBlocs(copie);
  }

  function majTexte(index: number, texte: string) {
    setBlocs(
      blocs.map((b, i) => (i === index && b.type === "texte" ? { ...b, texte } : b)),
    );
  }

  function majMedia(index: number, champ: "url" | "legende", valeur: string) {
    setBlocs(
      blocs.map((b, i) =>
        i === index && (b.type === "photo" || b.type === "video" || b.type === "document")
          ? { ...b, [champ]: valeur }
          : b,
      ),
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-germe-ink/60">
        Contenu de la leçon (texte et médias, dans l'ordre d'affichage)
      </p>

      {blocs.length === 0 && (
        <p className="rounded-lg border border-dashed border-germe-ink/15 px-3 py-3 text-center text-xs text-germe-ink/40">
          Aucun bloc — ajoutez du texte ou un média ci-dessous.
        </p>
      )}

      <div className="space-y-2">
        {blocs.map((bloc, i) => (
          <div
            key={bloc.id}
            className="flex gap-2 rounded-lg border border-germe-ink/10 bg-white p-2"
          >
            <div className="flex shrink-0 flex-col items-center gap-0.5 pt-1">
              <button
                type="button"
                onClick={() => deplacer(i, -1)}
                disabled={i === 0}
                aria-label="Monter"
                className="text-germe-ink/40 hover:text-germe-ink disabled:opacity-20"
              >
                ▲
              </button>
              <span className="text-[10px] text-germe-ink/30">
                {bloc.type === "texte"
                  ? "Texte"
                  : bloc.type === "photo"
                    ? "Photo"
                    : bloc.type === "video"
                      ? "Vidéo"
                      : "Document"}
              </span>
              <button
                type="button"
                onClick={() => deplacer(i, 1)}
                disabled={i === blocs.length - 1}
                aria-label="Descendre"
                className="text-germe-ink/40 hover:text-germe-ink disabled:opacity-20"
              >
                ▼
              </button>
            </div>

            <div className="min-w-0 flex-1 space-y-1.5">
              {bloc.type === "texte" ? (
                <EditeurTexteEnrichi
                  value={bloc.texte}
                  onChange={(v) => majTexte(i, v)}
                  rows={3}
                  placeholder="Texte du cours..."
                />
              ) : (
                <>
                  <ChampMedia
                    value={bloc.url}
                    onChange={(v) => majMedia(i, "url", v)}
                    placeholder={
                      bloc.type === "photo"
                        ? "URL de la photo"
                        : bloc.type === "video"
                          ? "URL de la vidéo"
                          : "URL du document PDF"
                    }
                    accept={
                      bloc.type === "document"
                        ? "application/pdf"
                        : bloc.type === "photo"
                          ? "image/*"
                          : "video/*"
                    }
                  />
                  <input
                    placeholder="Légende (optionnel)"
                    value={bloc.legende ?? ""}
                    onChange={(e) => majMedia(i, "legende", e.target.value)}
                    className="w-full rounded-lg border border-germe-ink/20 px-3 py-1.5 text-xs focus:border-germe-blue focus:outline-none"
                  />
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => retirer(i)}
              aria-label="Retirer ce bloc"
              className="shrink-0 self-start text-germe-ink/40 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => ajouter("texte")}
          className="rounded-full border border-germe-ink/20 px-3 py-1 text-[11px] font-medium text-germe-ink/70 hover:border-germe-blue hover:text-germe-blue"
        >
          + Texte
        </button>
        <button
          type="button"
          onClick={() => ajouter("photo")}
          className="rounded-full border border-germe-ink/20 px-3 py-1 text-[11px] font-medium text-germe-ink/70 hover:border-germe-blue hover:text-germe-blue"
        >
          + Photo
        </button>
        <button
          type="button"
          onClick={() => ajouter("video")}
          className="rounded-full border border-germe-ink/20 px-3 py-1 text-[11px] font-medium text-germe-ink/70 hover:border-germe-blue hover:text-germe-blue"
        >
          + Vidéo
        </button>
        <button
          type="button"
          onClick={() => ajouter("document")}
          className="rounded-full border border-germe-ink/20 px-3 py-1 text-[11px] font-medium text-germe-ink/70 hover:border-germe-blue hover:text-germe-blue"
        >
          + Document (PDF)
        </button>
      </div>
    </div>
  );
}
