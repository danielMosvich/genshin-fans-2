import { useState } from "react";
import type { WeaponProps } from "../../types/weapons";
import "./WeaponsData.css"
// 
function WeaponsData({ data }: { data: WeaponProps[] }) {
  const [filtro, setFiltro] = useState({
    name: "",
    subStat: "",
    baseAtack: "",
    type:""
  });
  const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro({
      ...filtro,
      [e.target.name]: e.target.value,
    });
  };
  const filtrarArmas = () => {
    return data.filter(
      (weapon) =>
        weapon.name.toLowerCase().includes(filtro.name.toLowerCase()) 
    );
  };
  const filteredWeapons = filtrarArmas()
  return (
    <div className="flex flex-wrap">
      <div
        className="dark:bg-neutral-950 fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]
      dark:bg-[linear-gradient(to_right,#f0f0f012_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f015_1px,transparent_1px)]"
      >
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_1000px_at_50%_200px,#c1c7ff88,transparent)] dark:bg-[radial-gradient(circle_1000px_at_50%_200px,#20244f9d,transparent)]"></div>
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4"
      style={{minHeight:"calc(100vh - 56px)"}}>
        {/* <div className="rounded-lg flex flex-col justify-center items-center gap-5 w-full mt-5"> */}
          <section className="bg-white/80 dark:bg-neutral-950/70 dark:shadow-none backdrop-blur-md shadow-xl shadow-neutral-300/50 rounded-lg px-3 py-3 flex gap-5 items-center justify-between w-full mt-5">
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
        {/* </div> */}


        <div className="grid grid-characters justify-items-center gap-8 mt-5 w-full 2xl:px-4 px-10">
          {filteredWeapons.map((e, i) => {
            return (
              <div key={i} className="w-24 flex flex-col">
                <a href={`/weapon/${e.imageName}`} className={`w-24 h-24 min-w-24 min-h-24 relative bg-${e.rarity}-stars rounded-lg`}>
                  <img
                    className="object-cover w-full h-full "
                    style={{ backgroundPosition: "center center" }}
                    src={`https://genshin.jmp.blue/weapons/${e.imageName}/icon`}
                    alt=""
                  />
                </a>
                <p className="dark:text-neutral-200 whitespace-nowrap overflow-hidden text-ellipsis text-sm font-semibold mt-1">{e.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default WeaponsData;
