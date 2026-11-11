import { Link, useParams } from "react-router-dom";

export default function ComingSoon() {
  const { name } = useParams();
  return (
    <div className="page narrow center">
      <h2>{name}</h2>
      <p className="muted">This module is coming soon.</p>
      <Link to="/" className="btn">Back to lobby</Link>
    </div>
  );
}
