import { useState } from "react";
import { ChevronDown, ChevronUp, Edit2, Trash2, Search, X, Save } from "lucide-react";
import { Exercise } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExerciseDemo } from "./ExerciseDemo";

interface Props {
  exercise: Exercise;
  onUpdate: (exercise: Exercise) => void;
  onDelete: (id: string) => void;
  onLog: (exercise: Exercise) => void;
}

export function ExerciseCard({ exercise, onUpdate, onDelete, onLog }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [form, setForm] = useState(exercise);

  const handleSave = () => {
    onUpdate(form);
    setEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden transition-all">
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{exercise.name}</h3>
          <p className="text-sm text-muted-foreground">
            {exercise.sets}x{exercise.reps} • {exercise.weight}kg
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="text-primary shrink-0" size={20} />
        ) : (
          <ChevronDown className="text-muted-foreground shrink-0" size={20} />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {editing ? (
            <div className="space-y-2">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nome do exercício"
                className="bg-muted"
              />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Séries</label>
                  <Input
                    type="number"
                    value={form.sets}
                    onChange={(e) => setForm({ ...form, sets: +e.target.value })}
                    className="bg-muted"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Reps</label>
                  <Input
                    type="number"
                    value={form.reps}
                    onChange={(e) => setForm({ ...form, reps: +e.target.value })}
                    className="bg-muted"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Peso (kg)</label>
                  <Input
                    type="number"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: +e.target.value })}
                    className="bg-muted"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} className="flex-1">
                  <Save size={16} className="mr-1" /> Salvar
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setEditing(false); setForm(exercise); }}>
                  <X size={16} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                <Edit2 size={14} className="mr-1" /> Editar
              </Button>
              <Button size="sm" variant="outline" onClick={() => onDelete(exercise.id)} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                <Trash2 size={14} className="mr-1" /> Excluir
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowDemo(!showDemo)} className="text-primary border-primary/30 hover:bg-primary/10">
                <Search size={14} className="mr-1" /> Como fazer?
              </Button>
              <Button size="sm" onClick={() => onLog(exercise)} className="ml-auto">
                Registrar treino
              </Button>
            </div>
          )}
          {showDemo && <ExerciseDemo exerciseName={exercise.name} />}
        </div>
      )}
    </div>
  );
}
