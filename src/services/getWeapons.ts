import type { WeaponProps } from "../types/weapons.ts";

export async function getWeapons() {
  try {
    const res = await fetch("https://genshin.jmp.blue/weapons/all");
    const allWeaponsData = await res.json() as WeaponProps[];

    const res2 = await fetch("https://genshin.jmp.blue/weapons/");
    const allNameWeaponsData = await res2.json() as string[];

    console.log(allWeaponsData.length, "ALL WEAPONS LONGITUD");
    console.log(allNameWeaponsData.length, "ALL NAMES LONGITUD");

    if (allWeaponsData.length && allNameWeaponsData.length) {
      const newArray: WeaponProps[] = [];
      allWeaponsData.forEach(objeto => {
        const name = objeto.name.toLowerCase().replace(/\s/g, '-'); // Convertir a minúsculas y reemplazar espacios con guiones
        const bestMatchIndex = allNameWeaponsData.findIndex(nameData => nameData.toLowerCase().includes(name));

        if (bestMatchIndex !== -1) {
            const nuevoObjeto = { ...objeto, imageName: allNameWeaponsData[bestMatchIndex] };
            newArray.push(nuevoObjeto);
        }
      });

      // Ordenar newArray por rarity (de mayor a menor)
      newArray.sort((a, b) => b.rarity - a.rarity);

      // console.log(newArray)
      return newArray;
    } else {
      console.error("Ocurrió un error ^^ Lo sentimos.");
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}
export async function getWeaponById(id:string){
  try {
    const res = fetch(`https://genshin.jmp.blue/weapons/${id}`)
    const data = (await res).json()
    return data
  } catch (error) {
    
  }
}
