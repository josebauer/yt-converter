import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Logo />

          <p className="text-center text-sm text-muted">
            © {new Date().getFullYear()} YT Converter.
          </p>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-muted">
            Utilize o conversor apenas para conteúdos
            cujo download e conversão sejam autorizados,
            respeitando os direitos autorais e os termos
            de uso das plataformas envolvidas.
          </p>
          <p className="text-muted text-center mt-4 text-sm">Desenvolvido por <a className="hover:underline" target="_blank" href="https://josebauer.com.br">José Henrique Bauer</a></p>
        </div>
      </div>
    </footer>
  );
}