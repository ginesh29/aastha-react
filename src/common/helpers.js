export const toSentenceCase = e => {
  let str = e.target.value;
  let result = "";
  if (str) {
    result = str[0].toUpperCase() + str.slice(1);
  }
  e.target.value = result;
};
