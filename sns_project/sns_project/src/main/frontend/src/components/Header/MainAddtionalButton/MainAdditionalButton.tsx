import Button from "../../Common/Button/Button";
import LogoutButton from "../LogoutButton/LogoutButton";
import "./MainAdditionalButton.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const MainAdditionalButton = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const navigateProfileButton = () => {
    navigate("/profile");
  };
  const MenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (MenuRef.current && !MenuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [MenuRef]);
  return (
    <div className="additional_menu" ref={MenuRef}>
      <Button
        type="button"
        text=""
        icon={<MenuIcon sx={{ fontSize: 16 }} />}
        onClick={() => setOpenMenu(!openMenu)}
      />
      {openMenu && (
        <div className="hamburgur_menu">
          <div className="menu" onClick={navigateProfileButton}>
            프로필
          </div>
          <div className="menu">darkmode</div>
          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export default MainAdditionalButton;
