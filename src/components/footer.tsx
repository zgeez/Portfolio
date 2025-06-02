export default function Footer() {
  return (
    <footer className="py-8 border-t bg-muted/30">
      <div className="container mx-auto text-center text-sm text-foreground/60">
        <p>&copy; {new Date().getFullYear()} Gayatri Sundar Rajan. All rights reserved.</p>
        <p>Built with Next.js and Tailwind CSS.</p>
      </div>
    </footer>
  );
}
