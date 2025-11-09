import { useEffect, useState } from "react";
import { NavLink, useNavigate, useOutletContext } from "react-router";
import {
  getCart,
  updateQuantity,
  removeFromCart,
  getCartTotal,
  clearCart,
} from "../utils/cart";

interface AuthContextType {
  currentUser: {
    user?: {
      role?: string;
      username?: string;
    };
  };
}

const Account = () => {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext<AuthContextType>();
  const [cart, setCart] = useState(getCart());
  const [total, setTotal] = useState(getCartTotal());

  useEffect(() => {
    if (currentUser.user?.role === "admin") {
      alert("您沒有權限查看此頁面，將為您導向首頁。");
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleQuantityChange = (id: string, delta: number) => {
    const item = cart.find((it) => it.id === id);
    if (!item) return;
    const newQty = item.qty + delta;
    const updatedCart = updateQuantity(id, newQty);
    setCart(updatedCart);
    setTotal(getCartTotal());
  };

  const handleRemove = (id: string) => {
    const updatedCart = removeFromCart(id);
    setCart(updatedCart);
    setTotal(getCartTotal());
  };

  const handleClear = () => {
    if (confirm("確定要清空購物車嗎？")) {
      clearCart();
      setCart([]);
      setTotal(0);
    }
  };

  return (
    <div className="pb-[160px] relative">
      {/* 頁首 */}
      <div className="flex gap-5 items-center justify-center w-full h-[100px] bg-[var(--theme-color-yellow)]">
        <NavLink to="/">
          <img className="size-[60px]" src="/Logo.png" alt="Logo" />
        </NavLink>
        <h3 className="text-white text-2xl sm:text-3xl text-center">
          會員中心 | 購物車
        </h3>
      </div>

      {/* 歡迎文字 */}
      <div className="text-xl sm:text-2xl p-6 text-center">
        Hi! <span className="font-semibold">{currentUser.user?.username}</span>{" "}
        歡迎來到會員中心
      </div>

      {/* 標題列 */}
      <div className="flex items-center w-full h-[70px] bg-[var(--theme-color-yellow)]">
        <h3 className="text-white text-2xl sm:text-3xl pl-6">購物清單</h3>
      </div>

      {/* 購物清單 */}
      <div className="p-6">
        {cart.length === 0 ? (
          <div className="text-center text-lg sm:text-xl">
            購物車目前沒有商品
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row justify-between items-center border-4 border-themeYellow rounded-2xl p-4 gap-4"
              >
                {/* 圖片 */}
                <img
                  className="w-[120px] h-[120px] object-cover rounded-xl"
                  src={item.mainImage}
                  alt={item.name}
                />

                {/* 商品資訊區：768px以上改為橫向排列 */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full text-center md:text-left flex-1 gap-2">
                  {/* 商品名稱與單價 */}
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-5">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-gray-600">
                      單價：${item.discountPrice ?? item.price}
                    </p>
                  </div>

                  {/* 數量控制與小計 */}
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-5 justify-center md:justify-end">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="px-3 border rounded-l text-lg"
                      >
                        -
                      </button>
                      <span className="px-3 text-lg">{item.qty}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="px-3 border rounded-r text-lg"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-lg">
                      小計：$
                      {((item.discountPrice ?? item.price) * item.qty).toFixed(
                        2
                      )}
                    </div>
                  </div>
                </div>

                {/* 移除按鈕 */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="px-5 py-2 bg-red-500 text-white rounded-[25px] hover:opacity-90 transition"
                >
                  移除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* === 🧾 浮動結帳區 === */}
      {cart.length > 0 && (
        <div
          className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md 
          border-t-4 border-themeYellow flex flex-col md:flex-row 
          justify-between items-center px-6 md:px-12 py-4 gap-3 z-40 shadow-lg"
        >
          <div className="text-lg sm:text-2xl font-semibold w-full text-center md:text-right">
            結帳總金額：
            <span className="text-red-600">${total.toFixed(2)}</span>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-3 w-full md:w-auto">
            <button
              onClick={handleClear}
              className="border-themeYellow rounded-[25px] cursor-pointer text-lg sm:text-2xl px-5 py-2"
            >
              清空購物車
            </button>
            <button
              onClick={() => navigate("/Checkout")}
              className="border-themeYellow bg-themeYellow text-white rounded-[25px] cursor-pointer text-lg sm:text-2xl px-5 py-2 hover:opacity-90 transition"
            >
              結帳
            </button>
          </div>
        </div>
      )}

      {/* 返回購物 */}
      <div className="flex justify-center sm:justify-end mt-6 sm:mr-10">
        <button
          className="border-themeYellow rounded-[25px] cursor-pointer text-lg sm:text-2xl px-8 py-2"
          onClick={() => navigate("/Shopping")}
        >
          繼續購物
        </button>
      </div>
    </div>
  );
};

export default Account;
