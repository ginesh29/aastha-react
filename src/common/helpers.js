export const toSentenceCase = e => {
  let str = e.target.value;
  let result = "";
  if (str) {
    result = str[0].toUpperCase() + str.slice(1);
  }
  e.target.value = result;
};

export const enumToObject = function(enumValue) {
  const keys = Object.keys(enumValue);
  const result = keys.map(key => {
    return enumValue[key];
  });
  return result;
};
