import { NavLink } from "react-router";
import { SquarePlus, ArrowUpToLine, Trash2 } from "lucide-react";

const GameNav = () => {
  return (
    <nav
      className="flex flex-row flex-wrap justify-center items-center 
      gap-3 sm:gap-6 lg:gap-4 xl:gap-6 
      w-[95vw] sm:w-[85vw] lg:w-[70vw] 
      mx-auto mt-5 p-3 sm:p-5 rounded-[20px] 
      bg-[var(--theme-color-yellow)] text-white shadow-md"
    >
      {/* Logo */}
      <NavLink to="/" className="flex items-center justify-center">
        <img
          className="size-[45px] sm:size-[55px]"
          src="/Logo.png"
          alt="Logo"
        />
      </NavLink>

      {/* Links */}
      <div
        className="flex flex-row justify-center items-center flex-wrap 
        gap-3 sm:gap-6 lg:gap-4 xl:gap-6 
        text-sm sm:text-base lg:text-lg xl:text-xl font-semibold"
      >
        <NavLink
          to="/admin/CreateGame"
          className={({ isActive }) =>
            `game-nav flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border-b-4 ${
              isActive
                ? "border-white"
                : "border-transparent hover:border-white transition"
            }`
          }
        >
          <SquarePlus className="size-6 sm:hidden" />
          <span className="hidden sm:inline">Add Game</span>
        </NavLink>

        <NavLink
          to="/admin/UpdateGame"
          className={({ isActive }) =>
            `game-nav flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border-b-4 ${
              isActive
                ? "border-white"
                : "border-transparent hover:border-white transition"
            }`
          }
        >
          <ArrowUpToLine className="size-6 sm:hidden" />
          <span className="hidden sm:inline">Update Game</span>
        </NavLink>

        <NavLink
          to="/admin/DeleteGame"
          className={({ isActive }) =>
            `game-nav flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border-b-4 ${
              isActive
                ? "border-white"
                : "border-transparent hover:border-white transition"
            }`
          }
        >
          <Trash2 className="size-6 sm:hidden" />
          <span className="hidden sm:inline">Delete Game</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default GameNav;
