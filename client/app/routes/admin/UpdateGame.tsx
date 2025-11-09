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

const UpdateGame = () => {
  const [originalName, setOriginalName] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");
  const [mainImages, setMainImages] = useState("");
  const [images, setImages] = useState("");
  const [tags, setTags] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [discountPrice, setDiscountPrice] = useState<number | "">("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { currentUser } = useOutletContext<AuthContextType>();

  useEffect(() => {
    if (currentUser.user?.role !== "admin") {
      alert("您沒有權限查看此頁面，將為您導向首頁。");
      navigate("/");
    }
  }, [currentUser, navigate]);

  const UpdateGameHandler = async () => {
    if (!originalName) {
      setMessage("請先輸入要更新的【原始遊戲名稱】！");
      return;
    }
    setMessage("");
    try {
      const payload: any = {};

      if (name && name !== originalName) payload.name = name;
      if (title) payload.title = title;
      if (article) payload.article = article;
      if (mainImages) payload.mainImages = mainImages;
      if (images) payload.images = images;

      if (tags)
        payload.tags = tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0);

      if (price !== "") payload.price = Number(price);
      if (discountPrice !== "") payload.discountPrice = Number(discountPrice);

      if (Object.keys(payload).length === 0) {
        setMessage("至少輸入一項更新內容");
        return;
      }

      await CrudGameService.updateGame(originalName, payload);

      alert("✅ 遊戲更新成功！");
      navigate("/Games");
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
        <h3 className="text-2xl md:text-3xl text-center">更新遊戲</h3>
        <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
          <label className="text-xl lg:text-2xl" htmlFor="originalName">
            遊戲原名：
          </label>
          <input
            type="text"
            id="originalName"
            value={originalName}
            className="w-[90%] sm:w-[60%] md:w-[70%] rounded-[25px]"
            onChange={(e) => setOriginalName(e.target.value)}
            placeholder="請輸入要更新的遊戲名稱"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
          <label className="text-xl lg:text-2xl" htmlFor="name">
            更改名稱：
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            className="w-[90%] sm:w-[60%] md:w-[70%] rounded-[25px]"
            onChange={(e) => setName(e.target.value)}
            placeholder="不改名稱就留空"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
          <label className="text-xl lg:text-2xl" htmlFor="title">
            更改標題：
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
            更改介紹：
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
            更改大圖：
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
            更改小圖：
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
            更改標籤：
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
            更改價格：
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
            更改優惠：
          </label>
          <input
            id="discountPrice"
            type="number"
            name="discountPrice"
            value={discountPrice}
            className="w-[90%] sm:w-[60%] md:w-[70%] rounded-[25px]"
            onChange={(e) => setDiscountPrice(Number(e.target.value))}
          />
        </div>
        <button
          onClick={UpdateGameHandler}
          className="mx-auto w-[85%] h-[50px] rounded-[25px] text-2xl cursor-pointer border-[var(--theme-color-yellow)] border-2"
        >
          更新遊戲
        </button>
      </div>
    </div>
  );
};

export default UpdateGame;
