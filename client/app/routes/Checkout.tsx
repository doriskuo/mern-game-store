import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCart, getCartTotal, clearCart } from "../utils/cart";
import AuthService from "../services/auth.service";

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(getCart());
  const [total, setTotal] = useState(getCartTotal());
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    // 若未登入則導回登入
    if (!currentUser) {
      alert("請先登入以進行結帳");
      localStorage.setItem("redirectAfterLogin", "/Checkout");
      navigate("/Signin");
      return;
    }
    // 若購物車是空的
    if (!cart.length) {
      alert("購物車是空的，請先選擇商品");
      navigate("/Shopping");
    }
  }, [currentUser, cart, navigate]);

  const handleConfirmOrder = () => {
    alert("✅ 模擬下單成功！感謝您的購買。");
    clearCart(); // 清空購物車
    navigate("/OrderComplete");
  };

  return (
    <div className="w-[80vw] mx-auto mt-10 text-2xl">
      <h2 className="text-4xl font-bold text-center mb-10">結帳確認</h2>

      <div className="mb-10">
        <h3 className="text-3xl mb-4">購物清單</h3>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-2xl">
            <tr>
              <th className="p-3">商品名稱</th>
              <th className="p-3">數量</th>
              <th className="p-3">單價</th>
              <th className="p-3">小計</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.qty}</td>
                <td className="p-3">${item.discountPrice ?? item.price}</td>
                <td className="p-3">
                  ${(item.discountPrice ?? item.price) * item.qty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-6 text-3xl">
          <span>總金額：</span>
          <span className="text-red-500 font-bold">${total}</span>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-3xl mb-4">收件資料（範例）</h3>
        <div className="space-y-2">
          <p>姓名：王小明</p>
          <p>電話：0912-345-678</p>
          <p>地址：台北市中正區忠孝東路 123 號</p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => navigate("/Shopping")}
          className="border-themeYellow rounded-[25px] cursor-pointer text-2xl px-10"
        >
          返回購物
        </button>
        <button
          onClick={handleConfirmOrder}
          className="bg-themeYellow text-white rounded-[25px] cursor-pointer text-2xl px-10"
        >
          確認送出
        </button>
      </div>
    </div>
  );
};

export default Checkout;
