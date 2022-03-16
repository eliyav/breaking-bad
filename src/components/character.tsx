import React from "react";
import { CharacterItem } from "./character-item";

export const Character: React.VFC<{ data: Character; close: () => void }> = ({
  data,
  close,
}) => {
  return (
    <div className="character-wrapper">
      <div className="character-display">
        <span className="close-character" onClick={() => close()}>
          X
        </span>
        <div className="title">Character Info</div>
        <CharacterItem label="Name: " text={data.name} />
        <CharacterItem label="Nickname: " text={data.nickname} />
        <div className="item">
          <label>Occupation: </label>
          {data.occupation.map((o, idx) => (
            <span key={idx}>{o} </span>
          ))}
        </div>
        <CharacterItem label="Birthday: " text={data.birthday} />
        <CharacterItem label="Status: " text={data.status} />
      </div>
    </div>
  );
};
