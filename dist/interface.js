var statusCharacter;
(function (statusCharacter) {
    statusCharacter[statusCharacter["Alive"] = 0] = "Alive";
    statusCharacter[statusCharacter["Dead"] = 1] = "Dead";
    statusCharacter[statusCharacter["unknown"] = 2] = "unknown";
})(statusCharacter || (statusCharacter = {}));
;
var genderCharacter;
(function (genderCharacter) {
    genderCharacter[genderCharacter["Female"] = 0] = "Female";
    genderCharacter[genderCharacter["Male"] = 1] = "Male";
    genderCharacter[genderCharacter["Genderless"] = 2] = "Genderless";
    genderCharacter[genderCharacter["unknown"] = 3] = "unknown";
})(genderCharacter || (genderCharacter = {}));
;
export {};
