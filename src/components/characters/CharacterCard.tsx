import { type CharactersProps } from "../../types/characters";
function CharacterCard({ item }: { item: CharactersProps }) {
  const characters = [
    "arataki-itto",
    "hu-tao",
    "kuki-shinobu",
    "raiden",
    "shikanoin-heizou",
    "yae-miko",
    "yun-jin",
  ];
  function encontrarCoincidencia(parametro: string, item?: CharactersProps) {
    if (item) {
      if (parametro === "traveler") {
        let visionMinus = item.vision_key.toLocaleLowerCase()
        return `traveler-${visionMinus}`;
      }
    }
    const coincidencia = characters.find((personaje) =>
      personaje.includes(parametro)
    );
    return coincidencia || parametro;
  }
  function obtenerSegundaPalabra(name: string) {
    if (name === "Raiden Shogun") {
      return "raiden";
    }
    let palabras = name.split(" ");

    if (palabras.length === 2) {
      return palabras[1].toLocaleLowerCase();
    } else {
      return name.toLocaleLowerCase();
    }
  }
  function verifyCharacterExist(name: string, vision: string) {
    if (name === "Navia") {
      return `../../../images/portrait/${name.toLowerCase()}.png`;
    }
    if (name === "Chevreuse") {
      return `../../../images/portrait/${name.toLowerCase()}.png`;
    }
    if (name === "Traveler") {
      return `https://genshin.jmp.blue/characters/traveler-${vision.toLowerCase()}/icon-big-aether`;
    }
    return `https://genshin.jmp.blue/characters/${encontrarCoincidencia(
      obtenerSegundaPalabra(name)
    )}/icon-big`;
  }
  return (
    <div className="w-24 h-24">
      <a
        className="relative"
        href={`/character/${encontrarCoincidencia(
          obtenerSegundaPalabra(item.name),
          item
        )}`}
      >
        <div
          className={`w-24 h-24 min-w-24 min-h-24  rounded-lg overflow-hidden ${
            item.rarity === 5
              ? "bg-gradient-to-b from-orange-400 to-amber-200"
              : "bg-gradient-to-b from-purple-400 to-fuchsia-200"
          }`}
        >
          <img
            className="w-full h-full object-cover object-center"
            src={verifyCharacterExist(item.name, item.vision)}
            alt=""
          />
        </div>
        <img
          className={`w-7 h-7 absolute  p-1 rounded-full -top-2 -right-2 ${
            item.rarity === 5 ? "bg-amber-500" : "bg-purple-400"
          }`}
          src={`https://genshin.jmp.blue/elements/${item.vision_key.toLocaleLowerCase()}/icon`}
          alt=""
        />
      </a>
      <h2 className="text-center capitalize text-sm font-[500] whitespace-nowrap overflow-ellipsis overflow-hidden dark:text-white">
        {encontrarCoincidencia(obtenerSegundaPalabra(item.name))}
      </h2>
    </div>
  );
}
export default CharacterCard;
