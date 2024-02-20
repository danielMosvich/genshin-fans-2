// To parse this data:
//
//   import { Convert } from "./file";
//
//   const charactersProps = Convert.toCharactersProps(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export type CharactersProps = {
    name:           string;
    title?:         string;
    vision:         Vision;
    weapon:         Weapon;
    gender?:        Gender;
    nation:         Nation;
    affiliation:    string;
    rarity:         number;
    release:        Date;
    constellation:  string;
    birthday:       string;
    description:    string;
    skillTalents:   SkillTalent[];
    passiveTalents: Constellation[];
    constellations: Constellation[];
    vision_key:     VisionKey;
    weapon_type:    WeaponType;
    specialDish?:   string;
    outfits?:       Outfit[];
    name_key?:      string;
}

export interface Constellation {
    name:        string;
    unlock:      ConstellationUnlock;
    description: string;
    level?:      number;
}

export enum ConstellationUnlock {
    ConstellationLV1 = "Constellation Lv. 1",
    ConstellationLV2 = "Constellation Lv. 2",
    ConstellationLV3 = "Constellation Lv. 3",
    ConstellationLV4 = "Constellation Lv. 4",
    ConstellationLV5 = "Constellation Lv. 5",
    ConstellationLV6 = "Constellation Lv. 6",
    UnlockedAtAscension1 = "Unlocked at Ascension 1",
    UnlockedAtAscension4 = "Unlocked at Ascension 4",
    UnlockedAutomatically = "Unlocked Automatically",
}

export enum Gender {
    Female = "Female",
    Male = "Male",
}

export enum Nation {
    Fontaine = "Fontaine",
    Inazuma = "Inazuma",
    Liyue = "Liyue",
    Mondstadt = "Mondstadt",
    Outlander = "Outlander",
    Snezhnaya = "Snezhnaya",
    Sumeru = "Sumeru",
    Unknown = "Unknown",
}

export interface Outfit {
    type:        string;
    name:        string;
    description: string;
    rarity:      number;
    price?:      number;
    image?:      string;
}

export interface SkillTalent {
    name:        string;
    unlock:      SkillTalentUnlock;
    description: string;
    upgrades?:   Upgrade[];
    type?:       Type;
}

export enum Type {
    ElementalBurst = "ELEMENTAL_BURST",
    ElementalSkill = "ELEMENTAL_SKILL",
    NormalAttack = "NORMAL_ATTACK",
}

export enum SkillTalentUnlock {
    ElementalBurst = "Elemental Burst",
    ElementalSkill = "Elemental Skill",
    NormalAttack = "Normal Attack",
    RightClick = "Right Click",
    UnlockElementalBurst = "Elemental burst",
    UnlockElementalSkill = "Elemental skill",
    UnlockNormalAttack = "Normal attack",
}

export interface Upgrade {
    name:  string;
    value: string;
}

export enum Vision {
    Anemo = "Anemo",
    Cryo = "Cryo",
    Dendro = "Dendro",
    Electro = "Electro",
    Geo = "Geo",
    Hydro = "Hydro",
    Pyro = "Pyro",
}

export enum VisionKey {
    Anemo = "ANEMO",
    Cryo = "CRYO",
    Dendro = "DENDRO",
    Electro = "ELECTRO",
    Geo = "GEO",
    Hydro = "HYDRO",
    Pyro = "PYRO",
}

export enum Weapon {
    Bow = "Bow",
    Catalyst = "Catalyst",
    Claymore = "Claymore",
    Polearm = "Polearm",
    Sword = "Sword",
}

export enum WeaponType {
    Bow = "BOW",
    Catalyst = "CATALYST",
    Claymore = "CLAYMORE",
    Polearm = "POLEARM",
    Sword = "SWORD",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toCharactersProps(json: string): CharactersProps[] {
        return cast(JSON.parse(json), a(r("CharactersProps")));
    }

    public static charactersPropsToJson(value: CharactersProps[]): string {
        return JSON.stringify(uncast(value, a(r("CharactersProps"))), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "CharactersProps": o([
        { json: "name", js: "name", typ: "" },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "vision", js: "vision", typ: r("Vision") },
        { json: "weapon", js: "weapon", typ: r("Weapon") },
        { json: "gender", js: "gender", typ: u(undefined, r("Gender")) },
        { json: "nation", js: "nation", typ: r("Nation") },
        { json: "affiliation", js: "affiliation", typ: "" },
        { json: "rarity", js: "rarity", typ: 0 },
        { json: "release", js: "release", typ: Date },
        { json: "constellation", js: "constellation", typ: "" },
        { json: "birthday", js: "birthday", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "skillTalents", js: "skillTalents", typ: a(r("SkillTalent")) },
        { json: "passiveTalents", js: "passiveTalents", typ: a(r("Constellation")) },
        { json: "constellations", js: "constellations", typ: a(r("Constellation")) },
        { json: "vision_key", js: "vision_key", typ: r("VisionKey") },
        { json: "weapon_type", js: "weapon_type", typ: r("WeaponType") },
        { json: "specialDish", js: "specialDish", typ: u(undefined, "") },
        { json: "outfits", js: "outfits", typ: u(undefined, a(r("Outfit"))) },
        { json: "name_key", js: "name_key", typ: u(undefined, "") },
    ], false),
    "Constellation": o([
        { json: "name", js: "name", typ: "" },
        { json: "unlock", js: "unlock", typ: r("ConstellationUnlock") },
        { json: "description", js: "description", typ: "" },
        { json: "level", js: "level", typ: u(undefined, 0) },
    ], false),
    "Outfit": o([
        { json: "type", js: "type", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "rarity", js: "rarity", typ: 0 },
        { json: "price", js: "price", typ: u(undefined, 0) },
        { json: "image", js: "image", typ: u(undefined, "") },
    ], false),
    "SkillTalent": o([
        { json: "name", js: "name", typ: "" },
        { json: "unlock", js: "unlock", typ: r("SkillTalentUnlock") },
        { json: "description", js: "description", typ: "" },
        { json: "upgrades", js: "upgrades", typ: u(undefined, a(r("Upgrade"))) },
        { json: "type", js: "type", typ: u(undefined, r("Type")) },
    ], false),
    "Upgrade": o([
        { json: "name", js: "name", typ: "" },
        { json: "value", js: "value", typ: "" },
    ], false),
    "ConstellationUnlock": [
        "Constellation Lv. 1",
        "Constellation Lv. 2",
        "Constellation Lv. 3",
        "Constellation Lv. 4",
        "Constellation Lv. 5",
        "Constellation Lv. 6",
        "Unlocked at Ascension 1",
        "Unlocked at Ascension 4",
        "Unlocked Automatically",
    ],
    "Gender": [
        "Female",
        "Male",
    ],
    "Nation": [
        "Fontaine",
        "Inazuma",
        "Liyue",
        "Mondstadt",
        "Outlander",
        "Snezhnaya",
        "Sumeru",
        "Unknown",
    ],
    "Type": [
        "ELEMENTAL_BURST",
        "ELEMENTAL_SKILL",
        "NORMAL_ATTACK",
    ],
    "SkillTalentUnlock": [
        "Elemental Burst",
        "Elemental Skill",
        "Normal Attack",
        "Right Click",
        "Elemental burst",
        "Elemental skill",
        "Normal attack",
    ],
    "Vision": [
        "Anemo",
        "Cryo",
        "Dendro",
        "Electro",
        "Geo",
        "Hydro",
        "Pyro",
    ],
    "VisionKey": [
        "ANEMO",
        "CRYO",
        "DENDRO",
        "ELECTRO",
        "GEO",
        "HYDRO",
        "PYRO",
    ],
    "Weapon": [
        "Bow",
        "Catalyst",
        "Claymore",
        "Polearm",
        "Sword",
    ],
    "WeaponType": [
        "BOW",
        "CATALYST",
        "CLAYMORE",
        "POLEARM",
        "SWORD",
    ],
};
