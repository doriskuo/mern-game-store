import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

class AuthService {
  login(email: string, password: string) {
    return axios.post(
      `${API_URL}/login`,
      { email, password },
      { withCredentials: true }
    );
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(username: string, email: string, password: string, role: string) {
    return axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
      role,
    });
  }

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
}

export default new AuthService();
