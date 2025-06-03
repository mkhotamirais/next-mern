export default function Footer() {
  return (
    <footer className="py-4">
      <div className="container flex items-center justify-center">
        <p>
          <small>Copyright &copy; {new Date().getFullYear()}</small>
        </p>
      </div>
    </footer>
  );
}
