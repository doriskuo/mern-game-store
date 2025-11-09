import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="footer">
      <Link to="/">
        <img
          src="/Logo.png"
          alt="Logo"
          className="size-[80px] sm:size-[100px]"
        />
      </Link>
      <h2 className="text-md text-white sm:text-2xl">
        Doris's Portfolio &copy; 2025 Copyright
      </h2>
    </footer>
  );
};

export default Footer;
