export const toSentenceCase = e => {
  let str = e.target.value;
  let result = "";
  if (str) {
    result = str[0].toUpperCase() + str.slice(1);
  }
  e.target.value = result;
};

export const enumToObject = function (enumValue) {
  const keys = Object.keys(enumValue);
  const result = keys.map(key => {
    return enumValue[key];
  });
  return result;
};
// export const enumToObject1 = function (jsonList) {
//   jsonList.map(item, index => {
//     // if (jsonObj[i].Id == 3) {
//     //   jsonObj[i].Username = "Thomas";
//     //   break;
//     // }
//   })
//   // for (var i = 0; i < jsonObj.length; i++) {
//   //   if (jsonObj[i].Id == 3) {
//   //     jsonObj[i].Username = "Thomas";
//   //     break;
//   //   }
//   // }
// }
