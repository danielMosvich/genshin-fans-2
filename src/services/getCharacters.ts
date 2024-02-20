import { type CharactersProps } from "../types/characters";

export async function getCharacters() {
  const res = await fetch("https://genshin.jmp.blue/characters/all");
  const dataAllCharacters = (await res.json()) as CharactersProps[];
  return dataAllCharacters
}
export async function getCharacterById(id:string){
    const res =await fetch(`https://genshin.jmp.blue/characters/${id}`)
    const dataCharacterById = await res.json() as CharactersProps
    return dataCharacterById
}
