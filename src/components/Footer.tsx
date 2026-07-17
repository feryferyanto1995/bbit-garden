import './footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <p className="label">
        © {new Date().getFullYear()} bbit — planted &amp; tended by Fery
      </p>
      <p className="footer-line">grown, not built.</p>
    </footer>
  );
}
