import { useState } from "react";
import { useNavigate } from "react-router";
import AuthService from "../services/auth.service";
import { AxiosError } from "axios";

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem("user", JSON.stringify(response.data));
      window.dispatchEvent(new Event("storage"));

      const redirectPath = localStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        alert("登入成功！即將導回您先前的頁面。");
        navigate(redirectPath);
        return;
      }

      const role = response.data?.user?.role;
      if (role === "admin") {
        alert("登入成功！即將導向後台建立遊戲頁面。");
        navigate("/admin/CreateGame");
      } else {
        alert("登入成功！即將導向個人帳號頁面。");
        navigate("/Account");
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        setMessage(e.response?.data || "伺服器錯誤");
      } else {
        setMessage("發生未知錯誤");
      }
    }
  };

  const handleGoogleLogin = async () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10">
      {message && (
        <div className="w-full max-w-[60%] text-center text-lg sm:text-xl bg-red-200 text-red-600 rounded-[20px] mb-6 py-3 px-5">
          {message}
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-center items-stretch w-full max-w-[70%] gap-8">
        {/* 左：帳號密碼登入 */}
        <div className="flex flex-col flex-1 gap-6 p-6 sm:p-8 border-4 border-[var(--theme-color-yellow)] rounded-[25px] shadow-lg">
          <h3 className="text-2xl sm:text-3xl text-center font-semibold">
            帳號密碼登入
          </h3>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-lg sm:text-2xl sm:w-[80px] text-center sm:text-right">
                信箱：
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-[25px] border-2 border-gray-300 px-3 py-2 text-base sm:text-lg"
                type="email"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-lg sm:text-2xl sm:w-[80px] text-center sm:text-right">
                密碼：
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 rounded-[25px] border-2 border-gray-300 px-3 py-2 text-base sm:text-lg"
                type="password"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <button
              onClick={handleLogin}
              className="w-full h-[50px] rounded-[25px] text-xl sm:text-2xl border-2 border-[var(--theme-color-yellow)] hover:bg-[var(--theme-color-yellow)] hover:text-white transition"
            >
              登入
            </button>
            <button
              onClick={() => navigate("/Register")}
              className="w-full h-[50px] rounded-[25px] text-xl sm:text-2xl border-2 border-[var(--theme-color-yellow)] hover:bg-[var(--theme-color-yellow)] hover:text-white transition"
            >
              註冊
            </button>
          </div>
        </div>

        {/* 右：快速登入 */}
        <div className="flex flex-col justify-center flex-1 gap-6 p-6 sm:p-8 border-4 border-[var(--theme-color-yellow)] rounded-[25px] shadow-lg">
          <h3 className="text-2xl sm:text-3xl text-center font-semibold">
            快速登入
          </h3>
          <button
            onClick={handleGoogleLogin}
            className="flex flex-col lg:flex-row gap-3 items-center justify-center mx-auto w-full border-2 border-[var(--theme-color-yellow)] rounded-[25px] text-lg sm:text-2xl py-3 px-4 hover:bg-[var(--theme-color-yellow)] hover:text-white transition"
          >
            <img
              className="size-[30px]"
              src="/google-icon.png"
              alt="googlelogo"
            />
            使用 Google 帳號登入
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
