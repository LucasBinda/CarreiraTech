import { Link } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight">CarreiraTech</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Data · Mercado · Vagas</span>
          </div>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link to="/" activeOptions={{ exact: true }} className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground bg-secondary" }}>
            Início
          </Link>
          <Link to="/dashboard" className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground bg-secondary" }}>
            Dashboard
          </Link>
          <Link to="/recomendacoes" className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground bg-secondary" }}>
            Recomendações
          </Link>
          <Link to="/sobre" className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground bg-secondary" }}>
            Sobre
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-card/30 py-8 mt-20">
      <div className="mx-auto max-w-7xl px-6 text-sm text-muted-foreground flex flex-col md:flex-row justify-between gap-2">
        <p>© 2026 CarreiraTech · Projeto Integrador III · Ciência de Dados</p>
        <p>Dados simulados a partir de padrões do mercado brasileiro de TI</p>
      </div>
    </footer>
  );
}
