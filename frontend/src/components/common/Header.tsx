import Logo from "./Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 sm:bg-background/80 sm:backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav
          aria-label="Navegação principal"
          className="flex items-center gap-6"
        >
          <a
            href="#converter"
            className="hidden text-sm font-medium text-muted transition-colors hover:text-foreground sm:block"
          >
            Conversor
          </a>

          <a
            href="#how-it-works"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Como funciona
          </a>
        </nav>
      </div>
    </header>
  );
}