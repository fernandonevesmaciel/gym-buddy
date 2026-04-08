import { useState, useEffect } from "react";
import { Loader2, ExternalLink } from "lucide-react";

interface ExerciseInfo {
  name: string;
  gifUrl: string;
  target: string;
  bodyPart: string;
  equipment: string;
  instructions: string[];
}

export function ExerciseDemo({ exerciseName }: { exerciseName: string }) {
  const [loading, setLoading] = useState(true);
  const [exercise, setExercise] = useState<ExerciseInfo | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const searchExercise = async () => {
      setLoading(true);
      setError(false);
      try {
        // Use a free exercise API - wger
        const res = await fetch(
          `https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(exerciseName)}&language=2&format=json`
        );
        const data = await res.json();
        
        if (data.suggestions && data.suggestions.length > 0) {
          const suggestion = data.suggestions[0];
          const exId = suggestion.data?.id;
          
          // Get exercise details
          const detailRes = await fetch(`https://wger.de/api/v2/exercise/${exId}/?format=json`);
          const detail = await detailRes.json();
          
          // Get exercise images
          const imgRes = await fetch(`https://wger.de/api/v2/exerciseimage/?exercise=${exId}&format=json`);
          const imgData = await imgRes.json();
          
          setExercise({
            name: suggestion.data?.name || exerciseName,
            gifUrl: imgData.results?.[0]?.image || "",
            target: detail.muscles?.join(", ") || "N/A",
            bodyPart: detail.category?.name || "N/A",
            equipment: detail.equipment?.map((e: any) => e.name).join(", ") || "N/A",
            instructions: detail.description
              ? [detail.description.replace(/<[^>]*>/g, "")]
              : ["Pesquise no YouTube por: " + exerciseName],
          });
        } else {
          setExercise(null);
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    searchExercise();
  }, [exerciseName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 text-muted-foreground">
        <Loader2 className="animate-spin mr-2" size={18} /> Buscando exercício...
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="bg-muted rounded-lg p-4 text-center space-y-2">
        <p className="text-sm text-muted-foreground">Não encontrado na base de dados.</p>
        <a
          href={`https://www.youtube.com/results?search_query=como+fazer+${encodeURIComponent(exerciseName)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary inline-flex items-center gap-1 hover:underline"
        >
          <ExternalLink size={14} /> Buscar no YouTube
        </a>
      </div>
    );
  }

  return (
    <div className="bg-muted rounded-lg p-4 space-y-3">
      <h4 className="font-medium text-sm text-foreground">{exercise.name}</h4>
      {exercise.gifUrl && (
        <img
          src={exercise.gifUrl}
          alt={exercise.name}
          className="w-full max-w-[280px] mx-auto rounded-lg"
        />
      )}
      {exercise.instructions.length > 0 && (
        <p className="text-sm text-muted-foreground">{exercise.instructions[0]}</p>
      )}
      <a
        href={`https://www.youtube.com/results?search_query=como+fazer+${encodeURIComponent(exerciseName)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-primary inline-flex items-center gap-1 hover:underline"
      >
        <ExternalLink size={14} /> Ver no YouTube
      </a>
    </div>
  );
}
