var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function getEpisodes(page = "") {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://rickandmortyapi.com/api/episode${page}`);
        const episodes = yield res.json();
        return episodes;
    });
}
export function getEpisode(episodeNum) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://rickandmortyapi.com/api/episode/${episodeNum.toString()}`);
        const episode = yield res.json();
        return episode;
    });
}
export function getCharacters(page = "") {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://rickandmortyapi.com/api/character${page}`);
        const characters = yield res.json();
        return characters;
    });
}
export function getCharacter(charNum) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://rickandmortyapi.com/api/character/${charNum.toString()}`);
        const character = yield res.json();
        return character;
    });
}
export function getLocations(page = "") {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://rickandmortyapi.com/api/location${page}`);
        const locations = yield res.json();
        return locations;
    });
}
export function getLocation(locationNum) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`https://rickandmortyapi.com/api/location/${locationNum.toString()}`);
        const location = yield res.json();
        return location;
    });
}
