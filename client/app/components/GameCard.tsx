import { useState, useEffect } from "react";
import displayGame from "app/services/displaygame.service";

const GameCard = () => {
  const [games, setGames] = useState<any[]>([]);
  const [currentIndexes, setCurrentIndexes] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [searchResult, setSearchResult] = useState<any[] | null>(null);
  const [message, setMessage] = useState("");

  // ✅ 頁面載入抓全部
  useEffect(() => {
    const fetchAllGames = async () => {
      try {
        const res = await displayGame.getAllGames();
        const data = res.data || [];

        setGames(data);
        setCurrentIndexes(Array(data.length).fill(0)); // 每個卡片預設顯示第一張圖( index = 0 )
      } catch (err) {
        setMessage("無法載入遊戲清單");
      }
    };

    fetchAllGames();
  }, []);

  // ✅ 搜尋處理
  const handleSearch = async () => {
    if (!name.trim()) {
      // 清空搜尋 → 回全部
      setSearchResult(null);
      setCurrentIndexes(Array(games.length).fill(0));
      return;
    }

    try {
      const res = await displayGame.searchGameByName(name);
      const game = res.data;

      if (!game) {
        setSearchResult([]);
        setCurrentIndexes([]);
        return;
      }

      setSearchResult([game]);
      setCurrentIndexes([0]);
    } catch (err) {
      setMessage("搜尋失敗");
    }
  };

  const handleClick = (cardIndex: number, imageIndex: number) => {
    setCurrentIndexes((prev) => {
      const updated = [...prev];
      updated[cardIndex] = imageIndex;
      return updated;
    });
  };

  const displayData = searchResult ?? games;

  return (
    <>
      {/* 🔍 搜尋欄 */}
      <div className="flex gap-3 mx-auto justify-center w-[80vw] md:w-[70vw] lg:w-[60vw] border-3 md:border-5 border-[var(--theme-color-yellow)] rounded-[25px] mt-2 mb-5 p-1 md:p-2">
        <input
          className="flex-8 rounded-[25px] focus:outline-none placeholder:text-gray-400 px-2"
          type="text"
          onChange={(e) => setName(e.target.value)}
          placeholder="輸入遊戲名稱搜尋"
        />
        <button
          className="flex-2 cursor-pointer text-sm text-[var(--theme-color-yellow)] sm:text-xl lg:text-2xl"
          onClick={handleSearch}
        >
          搜尋
        </button>
      </div>

      {/* 🃏 遊戲卡片 */}
      {displayData.map((story, i) => {
        const bigImg = story.mainImages[currentIndexes[i]]; // 大圖永遠跟 index 對
        const thumbs = story.images; // 後端 images 是小圖

        return (
          <div className="gamecard" key={story._id ?? i}>
            <div className="flex flex-col md:flex-row gap-4 xl:flex-[6]">
              {/* 大圖 */}
              <div className="flex-[5] overflow-hidden border-themeYellow border-[3px] md:border-[4px] lg:border-[5px]">
                <img
                  className="w-full h-full object-cover"
                  src={bigImg}
                  alt={story.name}
                  loading="lazy"
                />
              </div>

              {/* 小圖列 */}
              <div className="flex flex-row md:flex-col justify-between flex-[1]">
                {thumbs.map((src: string, j: number) => (
                  <div
                    key={j}
                    className="aspect-[5/3] overflow-hidden border-themeYellow border-[3px] md:border-[4px] lg:border-[5px]"
                  >
                    <img
                      className={`w-full h-full object-cover ${
                        j === currentIndexes[i]
                          ? "border-red-500 border-4"
                          : "border-transparent"
                      }`}
                      src={src}
                      alt={`${story.name}-${j}`}
                      onClick={() => handleClick(i, j)}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 文字區 */}
            <div className="flex flex-col justify-center xl:flex-[4] p-4 border-themeYellow border-3 md:border-5">
              <h1 className="text-xl sm:text-3xl text-center mb-2 sm:mb-4">
                {story.name}
              </h1>
              <h2 className="text-md sm:text-2xl text-center mb-2">
                {story.title}
              </h2>
              <p className="text-sm sm:text-md indent-8">{story.article}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default GameCard;
