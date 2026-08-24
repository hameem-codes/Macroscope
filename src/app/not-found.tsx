import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center">
            <span className="font-heading text-5xl font-extrabold text-accent">404</span>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-tertiary/20 rounded-full" />
          <div className="absolute -bottom-1 -left-3 w-6 h-6 bg-secondary/20 rotate-45" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-foreground mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-muted-foreground font-body mb-6">
          Something went wrong loading this view.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-white rounded-lg font-heading font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Back to Overview
        </Link>
      </div>
    </div>
  );
}
