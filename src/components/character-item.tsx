import React from "react";

export const CharacterItem: React.VFC<{
  label: string;
  text: string | string[];
}> = ({ label, text }) => {
  let display;
  {
    if (typeof text === "string") {
      display = <span>{text}</span>;
    } else {
      display = text.map((o, idx) => <span key={idx}>{o}-</span>);
    }
  }
  return (
    <div className="item">
      <label>{label}</label>
      {display}
    </div>
  );
};
