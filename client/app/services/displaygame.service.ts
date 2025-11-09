import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/games`;

class GameService {
  getAllGames() {
    return axios.get(API_URL);
  }

  searchGameByName(name: string) {
    return axios.get(`${API_URL}/name/${name}`);
  }

  getShopData() {
    return axios.get(`${API_URL}/shop`);
  }
}

export default new GameService();
