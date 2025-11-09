import Navbar from "~/components/Navbar";
import type { Route } from "./+types/Homepage";
import Footer from "~/components/Footer";
import { Outlet, useLocation } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sand box | Homepage" },
    { name: "description", content: "這是我的 MERN專案 首頁" },
  ];
}

const Homepage = () => {
  const location = useLocation();
  const hideFooter = ["/Signin", "/Register"].includes(location.pathname);
  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[120px] sm:pt-[160px] md:pt-[170px] lg:pt-[230px]">
        {" "}
        {/* ✅ 主要內容往下推 */}
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Homepage;
