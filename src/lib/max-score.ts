import type { ChecklistItem, Criteria, Task } from '@/types';
import { clamp } from '@/lib/utils';

export function computeMaxScore(input: {
  criteria: Criteria[];
  tasks: Task[];
  checklist: ChecklistItem[];
  hoursRemaining: number;
}): number {
  const { criteria, tasks, checklist, hoursRemaining } = input;
  const weightSum = criteria.reduce((s, c) => s + c.weight, 0) || 1;
  const criteriaScore =
    criteria.reduce((s, c) => s + (c.score / 10) * 100 * c.weight, 0) / weightSum;

  const required = checklist.filter((c) => c.required);
  const checklistScore = required.length
    ? (required.filter((c) => c.completed).length / required.length) * 100
    : 70;

  const active = tasks.filter((t) => t.status !== 'cut');
  const doneWeight = active.reduce((s, t) => s + (t.status === 'done' ? impactWeight(t.impactLevel) : 0), 0);
  const totalWeight = active.reduce((s, t) => s + impactWeight(t.impactLevel), 0) || 1;
  const planScore = (doneWeight / totalWeight) * 100;

  const timePressure = hoursRemaining < 0 ? 0.7 : hoursRemaining < 6 ? 0.85 : hoursRemaining < 24 ? 0.95 : 1;
  const raw = criteriaScore * 0.5 + checklistScore * 0.2 + planScore * 0.2 + 10 * timePressure;
  return Math.round(clamp(raw * timePressure, 0, 100));
}

function impactWeight(level: Task['impactLevel']) {
  switch (level) {
    case 'CRITICAL': return 4;
    case 'HIGH': return 3;
    case 'MEDIUM': return 2;
    default: return 1;
  }
}

export function scoreDrivers(input: {
  criteria: Criteria[];
  tasks: Task[];
  checklist: ChecklistItem[];
}) {
  const lowest = [...input.criteria].sort((a, b) => a.score - b.score)[0];
  const nextCritical = input.tasks.find((t) => t.status !== 'done' && t.status !== 'cut' && t.impactLevel === 'CRITICAL');
  const missing = input.checklist.filter((c) => c.required && !c.completed);
  return { lowest, nextCritical, missing };
}