import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import CrudGameService from "app/services/crudgame.service";
interface AuthContextType {
  currentUser: {
    user?: {
      role?: string;
    };
  };
}

const CreateGame = () => {
  let [name, setName] = useState("");
  let [title, setTitle] = useState("");
  let [article, setArticle] = useState("");
  let [mainImages, setMainImages] = useState("");
  let [images, setImages] = useState("");
  let [tags, setTags] = useState<string>("");
  let [price, setPrice] = useState<number>(0);
  let [discountPrice, setDiscountPrice] = useState<number>(0);
  let [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { currentUser } = useOutletContext<AuthContextType>();

  useEffect(() => {
    if (currentUser.user?.role !== "admin") {
      alert("您沒有權限查看此頁面，將為您導向首頁。");
      navigate("/");
    }
  }, [currentUser, navigate]);

  const createGameHandler = async () => {
    setMessage("");
    try {
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const response = await CrudGameService.createGame(
        name,
        title,
        article,
        mainImages,
        images,
        tagArray,
        price,
        discountPrice
      );
      alert("遊戲已成功建立！");
      setName("");
      setTitle("");
      setArticle("");
      setMainImages("");
      setImages("");
      setTags("");
      setPrice(0);
      setDiscountPrice(0);
    } catch (e: any) {
      setMessage(e.response?.data || "發生錯誤");
    }
  };

  return (
    <div>
      {message && (
        <div className="w-[70vw] text-xl bg-red-200 text-red-500 rounded-[25px] mt-6 mx-auto py-2 px-5">
          {message}
        </div>
      )}
      <div className="flex flex-col mx-auto mt-5 w-[70vw] p-10 gap-5 border-[var(--theme-color-yellow)] border-5 rounded-[25px]">
        <h3 className="text-2xl md:text-3xl text-center">創建遊戲</h3>
        <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
          <label className="text-xl lg:text-2xl" htmlFor="name">
            遊戲名稱：
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            className="w-[90%] sm:w-[60%] md:w-[70%] rounded-[25px]"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
          <label className="text-xl lg:text-2xl" htmlFor="title">
            遊戲標題：
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            className="w-[90%] sm:w-[60%] md:w-[70%] rounded-[25px]"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
          <label className="text-xl lg:text-2xl" htmlFor="article">
            遊戲介紹：
          </label>
          <textarea
            id="article"
            name="article"
            value={article}
            className="w-[90%] sm:w-[60%] md:w-[70%] rounded-[25px]"
            onChange={(e) => setArticle(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
          <label className="text-xl lg:text-2xl" htmlFor="mainImages">
            遊戲大圖：
          </label>
          <input
            id="mainImages"
            type="text"
            name="mainImages"
            value={mainImages}
            className="w-[90%] sm:w-[60%] md:w-[70%] rounded-[25px]"
            onChange={(e) => setMainImages(e.target.value)}
            placeholder="只輸入 base，例如 bubble（會生成 bubble1~5）"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
          <label className="text-xl lg:text-2xl" htmlFor="images">
            遊戲小圖：
          </label>
          <input
            id="images"
            type="text"
            name="images"
            value={images}
            className="w-[90%] sm:w-[60%] md:w-[70%] rounded-[25px]"
            onChange={(e) => setImages(e.target.value)}
            placeholder="只輸入 base，例如 bubble"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
          <label className="text-xl lg:text-2xl" htmlFor="tags">
            遊戲標籤：
          </label>
          <input
            id="tags"
            type="text"
            name="tags"
            value={tags}
            className="w-[90%] sm:w-[60%] md:w-[70%] rounded-[25px]"
            onChange={(e) => setTags(e.target.value)}
            placeholder="冒險, 角色扮演等，用逗號分隔"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
          <label className="text-xl lg:text-2xl" htmlFor="price">
            遊戲價格：
          </label>
          <input
            id="price"
            type="number"
            name="price"
            value={price}
            className="w-[90%] sm:w-[60%] md:w-[70%] rounded-[25px]"
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
          <label className="text-xl lg:text-2xl" htmlFor="discountPrice">
            優惠價格：
          </label>
          <input
            id="discountPrice"
            type="number"
            name="discountPrice"
            className="w-[90%] sm:w-[60%] md:w-[70%] rounded-[25px]"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(Number(e.target.value))}
          />
        </div>
        <button
          onClick={createGameHandler}
          className="mx-auto w-[85%] h-[50px] rounded-[25px] text-2xl cursor-pointer border-[var(--theme-color-yellow)] border-2"
        >
          創建遊戲
        </button>
      </div>
    </div>
  );
};

export default CreateGame;
