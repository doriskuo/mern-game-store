import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { clearCart } from "../utils/cart";

const OrderComplete = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5); // ✅ 倒數 5 秒

  useEffect(() => {
    // ✅ 清空購物車並刷新 Navbar badge
    clearCart();
    window.dispatchEvent(new Event("storage"));

    // ✅ 每秒更新倒數
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/"); // 自動返回首頁
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="text-center mt-20">
      <h1 className="text-5xl text-green-600 font-bold mb-6">🎉 訂單完成！</h1>
      <p className="text-2xl mb-10">感謝您的購買，我們將盡快為您出貨。</p>
      <p className="text-xl text-gray-600 mb-8">
        {countdown} 秒後將自動返回首頁...
      </p>
      <button
        onClick={() => navigate("/")}
        className="border-themeYellow rounded-[25px] cursor-pointer text-2xl px-10"
      >
        立即返回首頁
      </button>
    </div>
  );
};

export default OrderComplete;
