// Multi-step modal for posting a Give (offer) or Take (need).
// Steps: choose mode -> pick an item from the catalog (+ name, + urgent for Take)
// -> save to the API -> "Saved!" confirmation. Scope ends at saving.

import { useEffect, useState } from "react";
import { CATALOG } from "./options";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";

export default function GiveTakeModal({ onClose }) {
  const [step, setStep] = useState("choose"); // "choose" | "form" | "done"
  const [mode, setMode] = useState(null); // "give" | "take"
  const [selected, setSelected] = useState(null); // { item, category }
  const [name, setName] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function start(nextMode) {
    setMode(nextMode);
    setStep("form");
  }

  function reset() {
    setMode(null);
    setSelected(null);
    setName("");
    setUrgent(false);
    setError("");
    setStep("choose");
  }

  async function submit() {
    if (!selected) return;
    setSubmitting(true);
    setError("");
    const endpoint = mode === "give" ? "/api/skills" : "/api/needs";
    const body = {
      item: selected.item,
      category: selected.category,
      name: name.trim(),
      ...(mode === "take" ? { urgent } : {}),
    };
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStep("done");
    } catch (e) {
      setError("Couldn't save — is the server running?");
    } finally {
      setSubmitting(false);
    }
  }

  const giving = mode === "give";

  return (
    // Dimmed backdrop; clicking it closes the modal.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight">
            {step === "choose" && "Give or Take?"}
            {step === "form" && (giving ? "What can you offer?" : "What do you need?")}
            {step === "done" && "Done"}
          </h2>
          <Button size="sm" onClick={onClose} aria-label="Close">
            ✕
          </Button>
        </div>

        {/* Step: choose */}
        {step === "choose" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button size="lg" className="h-32 flex-col" onClick={() => start("give")}>
              <span className="text-3xl">🎁</span>
              Give something
            </Button>
            <Button size="lg" className="h-32 flex-col" onClick={() => start("take")}>
              <span className="text-3xl">🙋</span>
              Take something
            </Button>
          </div>
        )}

        {/* Step: form */}
        {step === "form" && (
          <div className="space-y-5">
            {CATALOG.map((group) => (
              <div key={group.category}>
                <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-neutral-600">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const isSel =
                      selected?.item === item && selected?.category === group.category;
                    return (
                      <Button
                        key={item}
                        size="sm"
                        variant={isSel ? "inverse" : "default"}
                        aria-pressed={isSel}
                        onClick={() => setSelected({ item, category: group.category })}
                      >
                        {item}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div>
              <label className="mb-1 block text-sm font-bold uppercase tracking-widest text-neutral-600">
                Your name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="So people know who to find"
              />
            </div>

            {!giving && (
              <label className="flex cursor-pointer items-center gap-2 font-bold uppercase tracking-wide">
                <input
                  type="checkbox"
                  className="h-5 w-5 border-2 border-black accent-black"
                  checked={urgent}
                  onChange={(e) => setUrgent(e.target.checked)}
                />
                Mark as urgent
              </label>
            )}

            {error && (
              <p className="border-2 border-black bg-neutral-100 p-2 text-sm font-bold">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between gap-3 pt-1">
              <Button onClick={reset}>← Back</Button>
              <Button
                variant="inverse"
                disabled={!selected || submitting}
                onClick={submit}
              >
                {submitting ? "Posting…" : "Post"}
              </Button>
            </div>
          </div>
        )}

        {/* Step: done */}
        {step === "done" && (
          <div className="space-y-5 text-center">
            <div className="text-6xl">✓</div>
            <div className="space-y-2">
              <p className="text-lg font-bold">Saved to the board!</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge variant="inverse">{giving ? "Give" : "Take"}</Badge>
                <Badge>{selected?.category}</Badge>
                <Badge>{selected?.item}</Badge>
                {!giving && urgent && <Badge variant="inverse">Urgent</Badge>}
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button onClick={reset}>Post another</Button>
              <Button variant="inverse" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
