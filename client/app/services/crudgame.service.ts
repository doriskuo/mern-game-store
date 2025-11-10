import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/admin/games`;

class CrudGameService {
  createGame(
    name: string,
    title: string,
    article: string,
    mainImagesBase: string,
    imagesBase: string,
    tags: string[],
    price: number,
    discountPrice: number
  ) {
    const stored = localStorage.getItem("user");
    const token = stored ? JSON.parse(stored).token : "";
    return axios.post(
      API_URL,
      {
        name,
        title,
        article,
        mainImages: mainImagesBase,
        images: imagesBase,
        tags,
        price,
        discountPrice,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
  }

  updateGame(originalName: string, payload: any) {
    const stored = localStorage.getItem("user");
    const token = stored ? JSON.parse(stored).token : "";

    return axios.patch(`${API_URL}/${originalName}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
  }

  deleteGame(name: string) {
    const stored = localStorage.getItem("user");
    const token = stored ? JSON.parse(stored).token : "";
    return axios.delete(`${API_URL}/${name}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
  }

  searchGame(params: { name?: string; id?: string; admin?: string }) {
    const stored = localStorage.getItem("user");
    const token = stored ? JSON.parse(stored).token : "";
    return axios.get(`${API_URL}/search`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
      params,
    });
  }
}

export default new CrudGameService();
