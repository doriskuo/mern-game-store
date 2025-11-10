import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import CrudGameService from "app/services/crudgame.service";

interface AuthContextType {
  currentUser: {
    user?: { role?: string };
  };
}

interface GameData {
  _id: string;
  name: string;
  tags: string[];
  status: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  admin?: { username: string; email: string };
  mainImages: string[];
  createdAt: string;
  updatedAt: string;
}

const SearchGame = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [admin, setAdmin] = useState("");
  const [games, setGames] = useState<GameData[]>([]);
  const [message, setMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});
  const navigate = useNavigate();
  const { currentUser } = useOutletContext<AuthContextType>();

  useEffect(() => {
    if (currentUser.user?.role !== "admin") {
      alert("您沒有權限查看此頁面，將為您導向首頁。");
      navigate("/");
    }
  }, [currentUser, navigate]);

  const searchHandler = async () => {
    setMessage("");
    try {
      const { data } = await CrudGameService.searchGame({ name, id, admin });
      setGames(data);
      if (data.length === 0) setMessage("查無符合條件的遊戲");
    } catch (e: any) {
      setGames([]);
      setMessage(e.response?.data || "搜尋失敗");
    }
  };

  const nextImage = (gameId: string, total: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [gameId]: ((prev[gameId] ?? 0) + 1) % total,
    }));
  };

  const prevImage = (gameId: string, total: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [gameId]: (prev[gameId] ?? 0) === 0 ? total - 1 : (prev[gameId] ?? 0) - 1,
    }));
  };

  return (
    <div className="flex flex-col items-center mt-8 w-[88vw] sm:w-[78vw] lg:w-[60vw] mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-[var(--theme-color-yellow)] drop-shadow-sm">
        🔍 查詢遊戲
      </h2>

      {/* 搜尋欄 */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 w-full mb-6">
        <input
          className="border-2 border-[var(--theme-color-yellow)] rounded-[20px] px-4 py-2 w-full sm:w-[25%] text-center focus:ring-2 focus:ring-[var(--theme-color-yellow)] outline-none"
          type="text"
          placeholder="依名稱搜尋"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border-2 border-[var(--theme-color-yellow)] rounded-[20px] px-4 py-2 w-full sm:w-[25%] text-center focus:ring-2 focus:ring-[var(--theme-color-yellow)] outline-none"
          type="text"
          placeholder="依 ID 搜尋"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          className="border-2 border-[var(--theme-color-yellow)] rounded-[20px] px-4 py-2 w-full sm:w-[25%] text-center focus:ring-2 focus:ring-[var(--theme-color-yellow)] outline-none"
          type="text"
          placeholder="依建立者搜尋"
          value={admin}
          onChange={(e) => setAdmin(e.target.value)}
        />
        <button
          className="bg-[var(--theme-color-yellow)] text-white font-semibold px-6 py-2 rounded-[20px] hover:opacity-85 transition"
          onClick={searchHandler}
        >
          搜尋
        </button>
      </div>

      {message && (
        <div className="w-full text-center text-lg text-red-500 mb-4">
          {message}
        </div>
      )}

      {/* 結果區 */}
      <div className="flex flex-col gap-5 w-full">
        {games.map((game) => {
          const index = currentImageIndex[game._id] ?? 0;
          const total = game.mainImages.length;
          const baseURL = import.meta.env.VITE_IMG_BASE_URL;

          return (
            <div
              key={game._id}
              className="border-[3px] border-[var(--theme-color-yellow)] rounded-[20px] p-4 bg-[var(--theme-color-yellow)] text-white shadow-md hover:shadow-xl transition-all max-w-[600px] mx-auto mb-3"
            >
              {/* 圖片輪播 */}
              <div className="relative flex justify-center items-center mb-3">
                <button
                  className="absolute left-[8%] text-base bg-white text-[var(--theme-color-yellow)] rounded-full size-7 flex items-center justify-center hover:scale-110 transition"
                  onClick={() => prevImage(game._id, total)}
                >
                  ‹
                </button>
                <img
                  src={`${baseURL}${game.mainImages[index]}`}
                  alt={game.name}
                  className="w-[60%] rounded-[12px] shadow-md object-cover border-2 border-white transition-transform hover:scale-105"
                />
                <button
                  className="absolute right-[8%] text-base bg-white text-[var(--theme-color-yellow)] rounded-full size-7 flex items-center justify-center hover:scale-110 transition"
                  onClick={() => nextImage(game._id, total)}
                >
                  ›
                </button>
              </div>

              {/* 單欄資訊直列 */}
              <div className="flex flex-col items-center gap-1 text-sm sm:text-base px-3 text-white">
                <p>
                  <strong>ID：</strong>
                  {game._id}
                </p>
                <p>
                  <strong>名稱：</strong>
                  {game.name}
                </p>
                <p>
                  <strong>建立者：</strong>
                  {game.admin?.username || "未知"}（{game.admin?.email || "無"}
                  ）
                </p>
                <p>
                  <strong>標籤：</strong>
                  {game.tags.join(", ")}
                </p>
                <p>
                  <strong>狀態：</strong>
                  {game.status}
                </p>
                <p>
                  <strong>價格：</strong>${game.price}
                  {game.discountPrice && (
                    <>
                      <span className="text-red-400 ml-1">
                        → ${game.discountPrice}
                      </span>
                      <span className="ml-1 text-sm text-white opacity-80">
                        ({game.discountPercentage}% off)
                      </span>
                    </>
                  )}
                </p>
                <p>
                  <strong>建立時間：</strong>
                  {new Date(game.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>更新時間：</strong>
                  {new Date(game.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchGame;
