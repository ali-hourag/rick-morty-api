export interface Episode {
    name: string;
    airDate: string;
    episodeCode: string;
}

export interface Character {
    name: string;
    status: string;
    species: string;
    gender: string;
    image: string;
}

export interface Location {
    name: string;
    type: string;
    dimension: string;
}

export interface LocationResident extends Location {
    residents: Array<Character>;
}

let obj: LocationResident = {
    name: 'hey',
    type: "si",
    dimension: "hj",
    residents: [{ name: "hj", status: "J", species: "j", gender: "sdf", image: "sdg" }]
}

console.log(obj);