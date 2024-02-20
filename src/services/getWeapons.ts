import { type WeaponProps } from "../types/weapons.ts";

export async function getWeapons() {
  try {
    const res = await fetch("https://genshin.jmp.blue/weapons/all");
    const allWeaponsData = (await res.json()) as WeaponProps[];

    const res2 = await fetch("https://genshin.jmp.blue/weapons/");
    const allNameWeaponsData = await res2.json();

    if (allWeaponsData.length === allNameWeaponsData.length) {
      var newArray: WeaponProps[] | undefined = [];
      for (let i = 0; i < allWeaponsData.length; i++) {
        let objeto = allWeaponsData[i];
        let nuevoObjeto = { ...objeto, imageName: allNameWeaponsData[i] };
        newArray.push(nuevoObjeto);
      }
      // console.log(newArray);
      return newArray;
    } else {
      console.error("ocurrio un error ^^ lo sentimos.");
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
  // Puedes retornar newArray si lo necesitas en algún otro lugar de tu aplicación
  // return newArray;
}
