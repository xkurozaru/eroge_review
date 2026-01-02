"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setToastMessage(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });
      if (!res.ok) {
        setToastMessage("ID か Password が間違っています");
        setTimeout(() => setToastMessage(null), 2500);
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {toastMessage && (
        <div className="fixed left-1/2 top-4 z-50 w-[min(420px,calc(100%-2rem))] -translate-x-1/2 rounded-md border bg-background px-4 py-3 text-sm shadow">
          {toastMessage}
        </div>
      )}

      <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
        <form
          onSubmit={onSubmit}
          className="w-full space-y-6 rounded-lg border bg-background p-6"
        >
          <h1 className="text-xl font-semibold">ログイン</h1>

          <div className="space-y-2">
            <label className="text-sm font-medium">ID</label>
            <input
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={id}
              onChange={(e) => setId(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background disabled:opacity-60"
          >
            ログイン
          </button>
        </form>
      </main>
    </div>
  );
}
