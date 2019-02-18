const coefficients = require("./coefficients.json");

// coefficients = {
//   c: { l: 542 },
//   v: { a: 21 },
//   c_f: 4095,
//   v_f: 255
// };

const cList = Object.keys(coefficients.c);
const cWeights = Object.values(coefficients.c);
const cK = getHexK(coefficients.c_f);
const vList = Object.keys(coefficients.v);
const vWeights = Object.values(coefficients.v);
const vK = getHexK(coefficients.v_f);

function getHexK(totalPossibilities) {
  const k = Math.log(totalPossibilities + 1) / Math.log(16);
  if (!Number.isInteger(k))
    throw Error(
      `totalPossibilities must be a power of 16: ${totalPossibilities}`
    );
  return k;
}

function getPseudoRandomItem(list, weight, nonce) {
  var weight_sum = 0;
  for (var i = 0; i < list.length; i++) {
    weight_sum += weight[i];
    if (nonce <= weight_sum) {
      return list[i];
    }
  }
  throw Error("No match found");
}

const getC = nonce => {
  if (nonce > coefficients.c_f)
    throw Error(
      `nonce "${nonce}" cannot be bigger than c_f "${coefficients.c_f}"`
    );
  return getPseudoRandomItem(cList, cWeights, nonce);
};
const getV = nonce => {
  if (nonce > coefficients.v_f)
    throw Error(
      `nonce "${nonce}" cannot be bigger than v_f "${coefficients.v_f}"`
    );
  return getPseudoRandomItem(vList, vWeights, nonce);
};

const pattern = ["c", "v", "c", "v", "c", "v"];

function nameGenerator(hexString) {
  if (!hexString || hexString.length < 20)
    throw Error("hexString should be defined and long enough");
  hexString = hexString.replace("0x", "");
  const wordParts = [];
  pattern.forEach(member => {
    if (member === "c") {
      const nonce = parseInt(hexString.slice(0, cK), 16);
      hexString = hexString.slice(cK);
      wordParts.push(getC(nonce));
    } else if (member === "v") {
      const nonce = parseInt(hexString.slice(0, vK), 16);
      hexString = hexString.slice(vK);
      wordParts.push(getV(nonce));
    } else {
      throw Error(`Unkown pattern member ${member}, must be "c" or "v"`);
    }
  });
  // Make sure the first member has only 1 character
  wordParts[0] = wordParts[0].slice(0, 1).toUpperCase();
  return wordParts.join("");
}

module.exports = nameGenerator;
