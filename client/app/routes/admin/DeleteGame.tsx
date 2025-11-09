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

const DeleteGame = () => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const { currentUser } = useOutletContext<AuthContextType>();
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser.user?.role !== "admin") {
      alert("您沒有權限查看此頁面，將為您導向首頁。");
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleDeleteGame = async () => {
    if (!name) {
      setMessage("請先輸入要刪除的遊戲名稱。");
      return;
    }

    const confirmDelete = window.confirm(`確定要刪除「${name}」嗎？`);
    if (!confirmDelete) return;
    setMessage("");
    try {
      const response = await CrudGameService.deleteGame(name);
      alert(response.data?.message || "遊戲已刪除");
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
      <div className="flex flex-col mx-auto mt-5 w-[70vw] p-10 gap-5 border-[var(--theme-color-yellow)] border-5">
        <h3 className="text-2xl md:text-3xl text-center">刪除遊戲</h3>
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
            placeholder="輸入要刪除的遊戲名稱"
          />
        </div>

        <button
          onClick={handleDeleteGame}
          className="mx-auto w-[85%] h-[50px] rounded-[25px] text-2xl cursor-pointer border-[var(--theme-color-yellow)] border-2"
        >
          刪除遊戲
        </button>
      </div>
    </div>
  );
};

export default DeleteGame;
