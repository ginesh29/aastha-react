export const toSentenceCase = e => {
  let str = e.target.value;
  let result = "";
  if (str) {
    result = str[0].toUpperCase() + str.slice(1);
  }
  e.target.value = result;
};

export const getEnumValue = (e, enumCollection, searchString) => {
  let result = [];
  if (searchString) {
    result = enumCollection.filter(l => {
      return l.label.toLowerCase().match(searchString.toLowerCase());
    });
  }
  return result.length ? result[0].value : -1;
}