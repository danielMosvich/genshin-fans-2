import React, { useState } from "react";
import CharacterCard from "./CharacterCard";
import type { CharactersProps } from "../../types/characters";

function CharacterData({ data }: { data: CharactersProps[] }) {
  const [filtro, setFiltro] = useState({
    name: "",
    vision: "",
    weapon: "",
  });
  const elements = [
    "anemo",
    "cryo",
    "dendro",
    "electro",
    "geo",
    "hydro",
    "pyro",
  ];
  const weapons = ["bow", "catalyst", "claymore", "polearm", "sword"];

  const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro({
      ...filtro,
      [e.target.name]: e.target.value,
    });
  };

  const changeVision = (e: string) => {
    if (filtro.vision === e) {
      setFiltro({
        ...filtro,
        vision: "",
      });
      return;
    }
    setFiltro({
      ...filtro,
      vision: e,
    });
  };
  const changeWeapon = (e: string) => {
    if (filtro.weapon === e) {
      setFiltro({
        ...filtro,
        weapon: "",
      });
      return;
    }
    setFiltro({
      ...filtro,
      weapon: e,
    });
  };
  const filtrarPersonajes = () => {
    return data.filter(
      (personaje) =>
        personaje.name.toLowerCase().includes(filtro.name.toLowerCase()) &&
        (filtro.vision === "" ||
          personaje.vision.toLowerCase() === filtro.vision.toLowerCase()) &&
        (filtro.weapon === "" ||
          personaje.weapon.toLowerCase() === filtro.weapon.toLowerCase())
    );
  };
  const filteredPersonajes: CharactersProps[] = filtrarPersonajes();
  return (
    <div
      className=" mx-auto flex flex-wrap justify-center items-start gap-10  max-w-sm md:max-w-2xl
      lg:max-w-5xl pb-10"
      style={{minHeight:"calc(100vh - 56px)"}}
    >
      <div className="rounded-lg flex flex-col justify-center items-center gap-5 w-full mt-5">
        <section className="bg-white/80 dark:bg-neutral-950/70 dark:shadow-none backdrop-blur-md shadow-xl shadow-neutral-300/50 rounded-lg px-5 py-3 flex gap-5 items-center justify-between w-full">
          <div className="flex gap-5 w-fit">
            {/* BY VISION */}
            <div className="flex gap-3">
              {elements.map((e: string, i) => (
                <button
                  className={`p-1 w-10 h-10 min-w10 min-h-10 ${
                    filtro.vision === e &&
                    "bg-gradient-to-b from-neutral-300 to-neutral-200 rounded-lg dark:to-neutral-800 dark:from-neutral-700"
                  }`}
                  key={i}
                  onClick={() => {
                    changeVision(e);
                  }}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={`https://genshin.jmp.blue/elements/${e}/icon`}
                  />
                </button>
              ))}
            </div>
            <span className="w-[1.5px] bg-neutral-400"></span>
            {/* BY WEAPON */}
            <div className="flex">
              {weapons.map((e: string, i) => (
                <button
                  className={`p-1 w-10 h-10 min-w10 min-h-10 ${
                    filtro.weapon === e &&
                    "bg-gradient-to-b from-neutral-300 to-neutral-200 rounded-lg dark:to-neutral-800 dark:from-neutral-700"
                  }`}
                  key={i}
                  onClick={() => {
                    changeWeapon(e);
                  }}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={`https://rerollcdn.com/GENSHIN/UI/weapon_${e}.png`}
                    alt=""
                  />
                </button>
              ))}
            </div>
          </div>

          {/* INPUT */}
          <div className="w-full">
            <input
              className="py-2 font-[400] px-3 outline-none rounded-lg w-full dark:bg-neutral-800/50 dark:ring-neutral-600 bg-neutral-100 ring-1 ring-neutral-200 dark:text-neutral-100"
              type="text"
              id="inputCharacter"
              name="name"
              placeholder="search character"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                changeName(e);
              }}
            />
          </div>
        </section>

        {/* CHARACTERS */}
        <section className="flex flex-wrap gap-8 mt-3">
          {filteredPersonajes.map((e, i) => {
            return (
              <div key={i}>
                <CharacterCard item={e} />
              </div>
            );
          })}
        </section>
      </div>



      <div className=" dark:bg-neutral-950 fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]
      dark:bg-[linear-gradient(to_right,#f0f0f012_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f015_1px,transparent_1px)]
      ">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_1000px_at_50%_200px,#c1c7ff88,transparent)] dark:bg-[radial-gradient(circle_1000px_at_50%_200px,#20244f9d,transparent)]" ></div>
      </div>
    </div>
  );
}

export default CharacterData;
