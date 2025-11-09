import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link, NavLink } from "react-router";
import { startPoints, endPoints } from "../data/svgPoints";
import {
  Gamepad2,
  ShoppingBag,
  Users,
  LogIn,
  LogOut,
  Castle,
} from "lucide-react";
import AuthService from "../services/auth.service";
import { getCartCount, clearCart } from "../utils/cart";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const polyRef = useRef(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(getCartCount());

  useEffect(() => {
    const stored = AuthService.getCurrentUser();
    if (stored && stored.user) setCurrentUser(stored.user);
  }, []);

  // ✅ GSAP 外框變形動畫（不 pin）
  useEffect(() => {
    const tween = gsap.fromTo(
      polyRef.current,
      { attr: { points: startPoints } },
      {
        attr: { points: endPoints },
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "+=2500",
          scrub: true,
        },
        ease: "none",
      }
    );
    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // ✅ 同步登入／購物車變化
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = AuthService.getCurrentUser();
      setCurrentUser(stored?.user || null);
      setCartCount(getCartCount());
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    clearCart();
    setCurrentUser(null);
    setCartCount(0);
    alert("您已成功登出");
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-center z-50 bg-white/10 backdrop-blur-md">
      <svg
        viewBox="0 0 1800 400"
        className="w-[90vw] h-[clamp(110px,20vw,250px)]"
        preserveAspectRatio="xMidYMid meet"
      >
        <polyline ref={polyRef} points={startPoints} className="nav-border" />
        <foreignObject x="120" y="120" width="90%" height="80%">
          <div className="flex flex-wrap justify-between items-center">
            {/* LOGO */}
            <Link to="/">
              <img
                className="w-[150px] sm:w-[200px]"
                src="/Logo.png"
                alt="Logo"
              />
            </Link>

            {/* GAMES */}
            <NavLink to="/Games" className="nav-link">
              <Gamepad2 className="nav-icon" />
              <span className="hidden sm:inline">GAMES</span>
            </NavLink>

            {/* SHOPPING（含徽章） */}
            <NavLink to="/Shopping" className="nav-link relative">
              <ShoppingBag className="nav-icon" />
              <span className="hidden sm:inline">SHOPPING</span>
              {cartCount > 0 && (
                <span className="absolute -top-5 -right-3 bg-red-500 text-white text-[28px] rounded-full px-2 py-0.5">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* ACCOUNT / ADMIN */}
            {currentUser?.role === "user" && (
              <NavLink to="/Account" className="nav-link">
                <Users className="nav-icon" />
                <span className="hidden sm:inline">ACCOUNT</span>
              </NavLink>
            )}
            {currentUser?.role === "admin" && (
              <NavLink to="/admin/CreateGame" className="nav-link">
                <Castle className="nav-icon" />
                <span className="hidden sm:inline">ADD GAME</span>
              </NavLink>
            )}

            {/* 登入登出 */}
            {currentUser ? (
              <NavLink to="/" onClick={handleLogout} className="mlauto">
                <LogOut className="nav-icon" />
                <div className="sign-out">sign out</div>
              </NavLink>
            ) : (
              <NavLink to="/Signin" className="mlauto">
                <LogIn className="nav-icon" />
                <div className="sign-in">sign in</div>
              </NavLink>
            )}
          </div>
        </foreignObject>
      </svg>
    </nav>
  );
};

export default Navbar;
