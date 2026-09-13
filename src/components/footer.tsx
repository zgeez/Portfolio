
export default function Footer() {
  return (
    <footer className="py-8 border-t bg-muted/30">
      <div className="container mx-auto text-center text-sm text-foreground/60">
        <p>&copy;{new Date().getFullYear()} Ziad Ghanem.</p>
      </div>
    </footer>
  );
}
