import { TrendingDown, ShoppingCart, Handbag } from "lucide-react";
import { useState, useEffect } from "react";
import displayGame from "app/services/displaygame.service";
import { addToCart, getCartCount } from "../utils/cart";
import AuthService from "../services/auth.service";

const ShoppingCard = () => {
  const [games, setGames] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [localCartCount, setLocalCartCount] = useState(getCartCount());

  useEffect(() => {
    displayGame
      .getShopData()
      .then((res) => setGames(res.data))
      .catch(() => setMessage("無法取得購物資料"));
  }, []);

  if (message)
    return <div className="text-center mt-10 text-red-500">{message}</div>;
  if (!games.length) return <div className="text-center mt-10">載入中...</div>;

  const handleAdd = (game: any) => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      alert("請先登入");
      window.location.href = "/Signin";
      return;
    }

    if (currentUser.user?.role === "admin") {
      alert("Admin 無法加入購物車，請用一般使用者登入");
      return;
    }

    addToCart({
      id: game._id,
      name: game.name,
      price: game.price,
      discountPrice: game.discountPrice,
      mainImage: game.mainImages?.[0],
      qty: 1,
    });

    setLocalCartCount(getCartCount());
    alert("商品已加入購物車");
  };

  const handleBuy = () => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      alert("請先登入");
      window.location.href = "/Signin";
      return;
    }

    if (currentUser.user?.role === "admin") {
      alert("Admin 無法使用直接購買功能");
      return;
    }

    window.location.href = "/account";
  };

  return (
    <div className="w-[90vw] mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-3">
      {games.map((game, i) => (
        <div
          key={i}
          className="flex flex-col mx-auto mt-5 border-themeYellow border-4 sm:border-5 
          w-[85vw] sm:w-[45vw] xl:w-[25vw] rounded-[25px] overflow-hidden 
          hover:shadow-xl hover:scale-[1.02] transition-transform duration-300"
        >
          <div className="w-full h-[200px] sm:h-[250px] md:h-[280px] overflow-hidden">
            <img
              className="object-cover w-full h-full"
              src={game.mainImages?.[0]}
              alt={game.name}
            />
          </div>

          <div className="flex flex-col p-3 justify-center items-center">
            <div className="flex gap-2 flex-wrap justify-center mb-3">
              {game.tags?.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="rounded-[25px] bg-themeYellow py-1 px-3 text-sm sm:text-base"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-2 text-center text-base sm:text-lg lg:text-xl mb-3">
              <div>
                原價：<span className="line-through">{game.price}</span>
              </div>
              <div>
                優惠價：
                <span className="text-red-500">{game.discountPrice}</span>
              </div>
              <div>
                下殺 <TrendingDown className="inline" />
                <span className="text-red-500">{game.discountPercentage}%</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handleAdd(game)}
                className="border-themeYellow border-2 rounded-[25px] cursor-pointer text-base sm:text-xl px-4 sm:px-5 py-1 sm:py-2 hover:bg-themeYellow hover:text-white transition-colors"
              >
                加入購物車 <ShoppingCart className="inline ml-1 sm:ml-2" />
              </button>

              <button
                onClick={handleBuy}
                className="border-themeYellow border-2 rounded-[25px] cursor-pointer text-base sm:text-xl px-4 sm:px-5 py-1 sm:py-2 hover:bg-themeYellow hover:text-white transition-colors"
              >
                直接購買 <Handbag className="inline ml-1 sm:ml-2" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShoppingCard;
