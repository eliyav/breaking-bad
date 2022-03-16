import React from "react";

export const CharacterItem: React.VFC<{ label: string; text: string }> = ({
  label,
  text,
}) => {
  return (
    <div className="item">
      <label>{label}</label>
      <span>{text}</span>
    </div>
  );
};
