import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/games`;

class GameService {
  getAllGames() {
    return axios.get(API_URL).catch((err) => {
      console.error("❌ getAllGames 失敗：", err);
      throw err;
    });
  }

  searchGameByName(name: string) {
    return axios.get(`${API_URL}/name/${name}`).catch((err) => {
      console.error("❌ searchGameByName 失敗：", err);
      throw err;
    });
  }

  getShopData() {
    return axios.get(`${API_URL}/shop`).catch((err) => {
      console.error("❌ getShopData 失敗：", err);
      throw err;
    });
  }
}

export default new GameService();
