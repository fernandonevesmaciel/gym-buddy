import { useMemo } from "react";
import { Flame, TrendingUp, Dumbbell, Calendar } from "lucide-react";
import { getProgress, getStreak, getTrainingLogs, ProgressEntry } from "@/lib/storage";

export function ProgressView() {
  const progress = getProgress();
  const streak = getStreak();
  const totalDays = getTrainingLogs().length;

  const exerciseGroups = useMemo(() => {
    const groups: Record<string, ProgressEntry[]> = {};
    progress.forEach((entry) => {
      const key = entry.exerciseName.toLowerCase();
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry);
    });
    // Sort each group by date
    Object.values(groups).forEach((g) => g.sort((a, b) => a.date.localeCompare(b.date)));
    return groups;
  }, [progress]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Flame className="mx-auto mb-2 text-accent" size={28} />
          <p className="text-2xl font-bold text-foreground">{streak}</p>
          <p className="text-xs text-muted-foreground">Dias seguidos</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Calendar className="mx-auto mb-2 text-primary" size={28} />
          <p className="text-2xl font-bold text-foreground">{totalDays}</p>
          <p className="text-xs text-muted-foreground">Total de treinos</p>
        </div>
      </div>

      {/* Exercise history */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" /> Evolução por Exercício
        </h3>
        {Object.keys(exerciseGroups).length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Dumbbell className="mx-auto mb-3 text-muted-foreground" size={32} />
            <p className="text-muted-foreground text-sm">
              Nenhum registro ainda. Registre um treino para ver seu progresso!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(exerciseGroups).map(([name, entries]) => {
              const latest = entries[entries.length - 1];
              const first = entries[0];
              const diff = latest.weight - first.weight;
              return (
                <div key={name} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground capitalize">{name}</h4>
                    {entries.length > 1 && (
                      <span className={`text-sm font-semibold ${diff >= 0 ? "text-success" : "text-destructive"}`}>
                        {diff >= 0 ? "+" : ""}{diff}kg
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {entries.slice(-8).map((entry, i) => (
                      <div key={i} className="bg-muted rounded px-3 py-2 text-center min-w-[70px] shrink-0">
                        <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</p>
                        <p className="text-sm font-bold text-foreground">{entry.weight}kg</p>
                        <p className="text-xs text-muted-foreground">{entry.sets}x{entry.reps}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
