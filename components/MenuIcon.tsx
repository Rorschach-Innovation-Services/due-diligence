// components/MenuIcon.tsx
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

interface MenuIconProps {
  onToggleMenu: () => void;
}

const MenuIcon = ({ onToggleMenu }: MenuIconProps) => {
  return (
    <div className="cursor-pointer md:hidden" onClick={onToggleMenu}>
      <FontAwesomeIcon icon={faBars} className="text-gray-400" />
    </div>
  );
};

export default MenuIcon;
