import React, { useEffect, useMemo, useRef, useState } from "react";
import AFRAME = require("aframe");
import walterWhite from "../assets/walter-white.jpg";
import skylerWhite from "../assets/skyler-white.jpg";
import walterWhiteJr from "../assets/walter-white-jr.webp";
import mikeEhrmantraut from "../assets/mike-ehrmantraut.jpg";
import { Character } from "./components/character";
import desert from "../assets/desert.jpg";

export const App: React.VFC = () => {
  const [appLoaded, setAppLoaded] = useState(false);
  const filterMenu = useRef<HTMLDivElement>(null);
  const [characterData, setCharacterData] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<{
    [char: string]: boolean;
  }>({});
  const [displayCharacter, setDisplayCharacter] = useState<Character>();
  const filteredList = useMemo(() => {
    return characterData?.filter(
      (char) => filteredCharacters[char.name] !== true
    );
  }, [filteredCharacters, characterData]);

  useEffect(() => {
    (async function fetchBreakingBad() {
      const data = await fetch(
        "https://www.breakingbadapi.com/api/characters/?limit=10"
      );
      const res = await data.json();
      setCharacterData(res);

      AFRAME.registerComponent("display-char", {
        init: function () {
          let el = this.el;
          function displayChar() {
            //@ts-ignore
            const data = res?.find((char: Character) => char.name === this.id);
            setDisplayCharacter(data);
          }
          el.addEventListener("click", displayChar);
        },
      });

      setAppLoaded(true);
    })();
  }, []);

  function toggleFilter() {
    if (filterMenu.current?.classList.contains("hide")) {
      filterMenu.current?.classList.remove("hide");
    } else {
      filterMenu.current?.classList.add("hide");
    }
  }

  function toggleSelected(e: { currentTarget: HTMLElement }) {
    const char = e.currentTarget.innerText as string;
    if (e.currentTarget.classList.contains("selected")) {
      e.currentTarget.classList.remove("selected");
      setFilteredCharacters((prevState) => {
        const newObj = { ...prevState };
        newObj[char] = false;
        return newObj;
      });
    } else {
      e.currentTarget.classList.add("selected");
      setFilteredCharacters((prevState) => {
        const newObj = { ...prevState };
        newObj[char] = true;
        return newObj;
      });
    }
  }

  useEffect(() => {}, []);

  return (
    <div className="app">
      {displayCharacter && (
        <Character
          data={displayCharacter}
          close={() => {
            setDisplayCharacter(undefined);
          }}
        />
      )}
      {appLoaded && (
        <>
          <div>
            <p className="filter-label" onClick={() => toggleFilter()}>
              Filter
            </p>
            <div ref={filterMenu} className="filter-container hide">
              {characterData?.map((char, idx) => (
                <div
                  key={idx}
                  className="filter"
                  onClick={(e) => {
                    toggleSelected(e);
                  }}
                >
                  {char.name}
                </div>
              ))}
            </div>
          </div>
          <a-scene cursor="rayOrigin: mouse">
            <a-assets>
              <img
                src={walterWhite}
                id="Walter White"
                crossOrigin="anonymous"
              ></img>
              <img
                src={skylerWhite}
                id="Skyler White"
                crossOrigin="anonymous"
              ></img>
              <img
                src={walterWhiteJr}
                id="Walter White Jr."
                crossOrigin="anonymous"
              ></img>
              <img
                src={mikeEhrmantraut}
                id="Mike Ehrmantraut"
                crossOrigin="anonymous"
              ></img>
              {characterData?.map((char, idx) => (
                <img
                  key={idx}
                  src={char.img}
                  id={char.name}
                  crossOrigin="anonymous"
                ></img>
              ))}
            </a-assets>
            <a-sky src={desert}></a-sky>
            {filteredList?.map((char, idx) => (
              <a-box
                key={idx}
                id={`${char.name}`}
                src={`#${char.name}`}
                position={`${0 + idx * 20} 0 ${-20 - idx * 10}`}
                rotation="0 45 0"
                scale="10 10 10"
                color="#4CC3D9"
                display-char
              >
                <a-text
                  value={`${char.name}`}
                  side="double"
                  position="-0.5 1 -0.5"
                  rotation="0 -45 0"
                  scale="1 1 1"
                  color="#000000"
                ></a-text>
              </a-box>
            ))}
          </a-scene>
        </>
      )}
    </div>
  );
};
