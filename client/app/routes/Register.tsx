import { useState } from "react";
import { useNavigate } from "react-router";
import AuthService from "../services/auth.service";
import type { AxiosError } from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = () => {
    AuthService.register(username, email, password, role)
      .then(() => {
        alert("註冊成功。您現在將被導向登入頁面");
        navigate("/Signin");
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          setMessage(e.response.data as string);
        } else {
          setMessage("發生未知錯誤");
        }
      });
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 ">
      <div
        className="flex flex-col w-full max-w-[600px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[50%]
        border-4 sm:border-5 border-[var(--theme-color-yellow)] rounded-[25px] p-6 sm:p-10
        shadow-lg bg-white"
      >
        <h2 className="text-2xl sm:text-3xl text-center font-semibold mb-6">
          註冊新會員
        </h2>

        {message && (
          <div className="text-base sm:text-lg bg-red-200 text-red-600 rounded-[20px] mb-6 py-3 px-5 text-center">
            {message}
          </div>
        )}

        <div className="flex flex-col gap-5 sm:gap-6">
          {/* 用戶名稱 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-lg sm:text-xl sm:w-[100px] text-center sm:text-right">
              用戶名稱：
            </label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className="flex-1 rounded-[25px] border-2 border-gray-300 px-3 py-2 text-base sm:text-lg"
              name="username"
            />
          </div>

          {/* 電子信箱 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-lg sm:text-xl sm:w-[100px] text-center sm:text-right">
              電子信箱：
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="flex-1 rounded-[25px] border-2 border-gray-300 px-3 py-2 text-base sm:text-lg"
              name="email"
            />
          </div>

          {/* 密碼 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-lg sm:text-xl sm:w-[100px] text-center sm:text-right">
              密碼：
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="flex-1 rounded-[25px] border-2 border-gray-300 px-3 py-2 text-base sm:text-lg"
              placeholder="至少 6 個字元"
              name="password"
            />
          </div>

          {/* 身份 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-lg sm:text-xl sm:w-[100px] text-center sm:text-right">
              身份：
            </label>
            <input
              onChange={(e) => setRole(e.target.value)}
              type="text"
              className="flex-1 rounded-[25px] border-2 border-gray-300 px-3 py-2 text-base sm:text-lg"
              placeholder="非必填，若為工作人員請填"
              name="role"
            />
          </div>
        </div>

        {/* 按鈕 */}
        <button
          onClick={handleRegister}
          className="mt-8 w-full h-[50px] rounded-[25px] text-xl sm:text-2xl border-2 border-[var(--theme-color-yellow)]
          hover:bg-[var(--theme-color-yellow)] hover:text-white transition"
        >
          註冊會員
        </button>
      </div>
    </div>
  );
};

export default Register;
