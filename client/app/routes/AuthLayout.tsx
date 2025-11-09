import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router";
import authService from "../services/auth.service";
import GameNav from "~/components/GameNav";

const AuthLayout = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      alert("請先登入");
      navigate("/Signin");
    } else {
      setCurrentUser(user);
    }
  }, [navigate]);

  if (!currentUser) return null;

  return (
    <div>
      <Outlet context={{ currentUser, setCurrentUser }} />
    </div>
  );
};

export default AuthLayout;
