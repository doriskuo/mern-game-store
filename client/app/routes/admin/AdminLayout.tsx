import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router";
import authService from "app/services/auth.service";
import GameNav from "~/components/GameNav";

const adminLayout = () => {
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
      <GameNav />
      <Outlet context={{ currentUser, setCurrentUser }} />
    </div>
  );
};

export default adminLayout;
