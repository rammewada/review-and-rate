"use client";
import { Link } from "react-router-dom";
import { cn } from "../utils/cn";

type ButtonTheme = "dark" | "blue";

type HeroBtnProps = {
  text: string;
  theme: ButtonTheme;
  type?: "button" | "submit";
  onClick?: () => void;
  link?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  role?: "button" | "link";
  className?: string;
};

const themeClasses: Record<ButtonTheme, string> = {
  blue: "custom-gradient test-sm text-white font-medium px-4 py-2 rounded-md hover:shadow-lg hover:shadow-gray-500 ",
  dark: "px-6 py-2 bg-gray-800 text-sm text-white  hover:bg-gray-700 rounded-md  ",
};

export function Button({
  text,
  theme,
  type = "button",
  onClick,
  link,
  target = "_self",
  role = "button",
  className = "",
}: HeroBtnProps) {
  const themeClass = themeClasses[theme];

  if (role === "link" && link) {
    return (
      <Link
        to={link}
        target={target}
        className={cn(
          ` inline-flex items-center justify-center cursor-pointer transition-all duration-300    `,
          themeClass,
          className,
        )}
      >
        {text}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        ` inline-flex items-center justify-center cursor-pointer transition-all duration-300   gap-3`,
        themeClass,
        className,
      )}
    >
      {text}
    </button>
  );
}
