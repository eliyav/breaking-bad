import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AFRAME = require("aframe");
import { Character } from "./components/character";
import desert from "../assets/desert.jpg";
import walterWhite from "../assets/walter-white.jpg";
import skylerWhite from "../assets/skyler-white.jpg";
import walterWhiteJr from "../assets/walter-white-jr.webp";
import mikeEhrmantraut from "../assets/mike-ehrmantraut.jpg";

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

  const toggleClass = useCallback((ele: HTMLElement, styleClass: string) => {
    if (ele.classList.contains(styleClass)) {
      ele.classList.remove(styleClass);
    } else {
      ele.classList.add(styleClass);
    }
  }, []);

  useEffect(() => {
    (async function fetchBreakingBad() {
      const data = await fetch(
        "https://www.breakingbadapi.com/api/characters/?limit=10"
      );
      const res = await data.json();
      setCharacterData(res);
      setAppLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (characterData.length)
      AFRAME.registerComponent("display-char", {
        init: function () {
          let el = this.el;
          function displayChar() {
            const data = characterData?.find(
              (char: Character) => char.name === el.id
            );
            setDisplayCharacter(data);
          }
          el.addEventListener("click", displayChar);
        },
      });
  }, [characterData]);

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
            <div
              className="filter-menu-button"
              onClick={(e) => toggleClass(filterMenu.current!, "hide")}
            >
              Filter
            </div>
            <div ref={filterMenu} className="filter-menu hide">
              {characterData?.map((char, idx) => (
                <div
                  key={idx}
                  className="filter-item"
                  onClick={(e) => {
                    toggleClass(e.currentTarget, "selected");
                    const char = e.currentTarget.innerText;
                    const filter =
                      e.currentTarget.classList.contains("selected");
                    setFilteredCharacters((prevState) => ({
                      ...prevState,
                      [char]: filter,
                    }));
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
              <img src={desert} id="desert" crossOrigin="anonymous"></img>
              {characterData?.map((char, idx) => {
                if (idx !== 0 && idx !== 2 && idx !== 3 && idx !== 6)
                  return (
                    <img
                      key={idx}
                      src={char.img}
                      id={char.name}
                      crossOrigin="anonymous"
                    ></img>
                  );
              })}
            </a-assets>
            <a-sky src={`#desert`}></a-sky>
            {filteredList?.map((char, idx) => (
              <a-box
                key={idx}
                id={`${char.name}`}
                src={`#${char.name}`}
                position={`${0 + idx * 20} 0 ${-20 - idx * 10}`}
                rotation="0 45 0"
                scale="10 10 10"
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
