"use client";
import { useState, useMemo } from "react";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

type Grade = { name: string; credits: string; grade: string };

const gradePoints: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "F": 0.0,
};

const gradeOptions = Object.keys(gradePoints);

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Grade[]>([
    { name: "Math", credits: "4", grade: "A" },
    { name: "English", credits: "3", grade: "B+" },
    { name: "Science", credits: "4", grade: "A-" },
  ]);

  const addRow = () => setCourses([...courses, { name: "", credits: "3", grade: "A" }]);
  const removeRow = (i: number) => setCourses(courses.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Grade, val: string) => {
    const next = [...courses];
    next[i] = { ...next[i], [field]: val };
    setCourses(next);
  };

  const gpa = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    for (const c of courses) {
      const cr = parseFloat(c.credits) || 0;
      const gp = gradePoints[c.grade] ?? 0;
      totalPoints += cr * gp;
      totalCredits += cr;
    }
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  }, [courses]);

  const totalCredits = courses.reduce((s, c) => s + (parseFloat(c.credits) || 0), 0);

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">GPA Calculator</h1>
      <p className="text-muted mb-6">Calculate your GPA on the standard 4.0 scale. Add your courses, credits, and letter grades.</p>

      <div className="space-y-2 mb-4">
        {courses.map((c, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input value={c.name} onChange={(e) => update(i, "name", e.target.value)} placeholder="Course" className="flex-1 bg-card-bg border border-card-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent min-w-0" />
            <input type="number" value={c.credits} onChange={(e) => update(i, "credits", e.target.value)} placeholder="Credits" className="w-20 bg-card-bg border border-card-border rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:border-accent" />
            <select value={c.grade} onChange={(e) => update(i, "grade", e.target.value)} className="w-18 bg-card-bg border border-card-border rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-accent">
              {gradeOptions.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <button onClick={() => removeRow(i)} className="p-2 text-muted-soft hover:text-danger transition-colors" title="Remove"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>

      <button onClick={addRow} className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors mb-6">
        <Plus size={16} /> Add Course
      </button>

      <div className="bg-surface border border-card-border rounded-xl p-5 space-y-3">
        <div className="flex justify-between"><span className="text-muted">Total Credits</span><span className="font-mono font-bold">{totalCredits}</span></div>
        <div className="flex justify-between border-t border-card-border pt-3">
          <span className="text-muted">Your GPA</span>
          <span className="font-mono font-bold text-3xl text-accent">{gpa}</span>
        </div>
        <p className="text-xs text-muted-soft">4.0 Scale — {gpa >= "3.5" ? "🎉 Excellent!" : gpa >= "3.0" ? "👍 Solid work!" : gpa >= "2.0" ? "📚 Keep pushing!" : "💪 You'll get there!"}</p>
      </div>
    </div>
  );
}
