import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container mx-auto container-px section-y text-center">
      <p className="font-display text-6xl font-bold text-primary">404</p>
      <p className="mt-3 text-muted-foreground">Page not found.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">Home</Link>
    </div>
  );
}
