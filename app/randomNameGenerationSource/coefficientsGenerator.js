const names = require("./namesCensus");
const fs = require("fs");

const consonants = {};
for (const group of [names.first_male, names.first_female]) {
  for (const name of group) {
    const charsArray = name
      .split(/[aeiouy]/gi)
      .filter(x => x)
      .map(x => x.toLowerCase());
    for (const chars of charsArray) {
      consonants[chars] = consonants[chars] ? consonants[chars] + 1 : 1;
    }
  }
}

const vowels = {};
for (const group of [names.first_male, names.first_female]) {
  for (const name of group) {
    const charsArray = (name.match(/[aeiouy]/gi) || [])
      .filter(x => x)
      .map(x => x.toLowerCase());
    for (const chars of charsArray) {
      vowels[chars] = vowels[chars] ? vowels[chars] + 1 : 1;
    }
  }
}

function containsDuplicatedCharacter(s) {
  return s.split("").some((v, i, a) => a.lastIndexOf(v) !== i);
}

function sortByProbability(obj) {
  return Object.keys(obj)
    .reduce((arr, key) => {
      arr.push({ key, val: obj[key] });
      return arr;
    }, [])
    .sort(function compare(a, b) {
      if (a.val < b.val) return 1;
      if (a.val > b.val) return -1;
      return 0;
    })
    .filter(({ key, val }) => {
      if (key.length > 3) return false;
      if (key.length > 2 && containsDuplicatedCharacter(key)) return false;
      if (val < 2) return false;
      return true;
    })
    .reduce((_obj, { key, val }) => {
      _obj[key] = val;
      return _obj;
    }, {});
}

function getTotalWeight(weight) {
  return weight.reduce((prev, cur) => prev + cur);
}

const consonantsOrd = sortByProbability(consonants);
const vowelsOrd = sortByProbability(vowels);
// reduce the magnitude of vowels coeficients by a factor of 235
const vowelsOrdLess = {};
for (const v of Object.keys(vowelsOrd)) {
  vowelsOrdLess[v] = Math.round(vowelsOrd[v] / 58);
}
const consonantsOrdLess = {};
for (const v of Object.keys(consonantsOrd)) {
  consonantsOrdLess[v] = Math.round(consonantsOrd[v] / 3.28);
}

console.log(consonantsOrdLess);
const consonantsTotalWeight = getTotalWeight(Object.values(consonantsOrdLess));
console.log(
  `consonants length: ${
    Object.keys(consonantsOrdLess).length
  } totalWeight: ${consonantsTotalWeight}`
);

console.log(vowelsOrdLess);
const vowelsTotalWeight = getTotalWeight(Object.values(vowelsOrdLess));
console.log(
  `consonants length: ${
    Object.keys(vowelsOrdLess).length
  } totalWeight: ${vowelsTotalWeight}`
);

// coefficients.json -> 1272 bytes
//  coefficients.csv -> 918  bytes (not worth it)

fs.writeFileSync(
  `${__dirname}/coefficients.json`,
  JSON.stringify({
    c: consonantsOrdLess,
    v: vowelsOrdLess,
    c_f: consonantsTotalWeight,
    v_f: vowelsTotalWeight
  })
);
