import { useEffect } from "react";
import { data, useNavigate } from "react-router";

export default function GoogleRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if (data) {
      const parsed = JSON.parse(decodeURIComponent(data));

      localStorage.setItem("user", JSON.stringify(parsed));

      const role = parsed.user?.role;
      if (role === "admin") {
        window.alert("登入成功！即將導向後台建立遊戲頁面。");
        navigate("/CreateGame");
      } else {
        window.alert("登入成功！即將導向個人帳號頁面。");
        navigate("/Account");
      }
    } else {
      navigate("/Signin");
    }
  }, [navigate]);

  return <p>登入中，請稍候...</p>;
}
