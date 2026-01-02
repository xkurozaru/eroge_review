import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function HomeHero() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="w-full max-w-3xl px-6 py-24">
        <Card>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold leading-10 tracking-tight">
                To get started, edit the page.tsx file.
              </h1>
              <p className="text-muted-foreground">
                Looking for a starting point or more instructions? Head over to
                Templates or the Learning center.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="https://vercel.com/new"
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "default" })}
              >
                Deploy Now
              </a>
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "outline" })}
              >
                Documentation
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
