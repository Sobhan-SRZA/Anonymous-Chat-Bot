export default function formatNumberWithCommas(number: number | string): string {
  let numStr = number.toString();
  let isNegative = false;
  if (numStr[0] === "-") {
    isNegative = true;
    numStr = numStr.slice(1); 
  }

  let decimalPart = "";
  const decimalIndex = numStr.indexOf(".");
  if (decimalIndex !== -1) {
    decimalPart = numStr.slice(decimalIndex); 
    numStr = numStr.slice(0, decimalIndex); 
  }

  let result = "";
  let count = 0;
  for (let i = numStr.length - 1; i >= 0; i--) {
    result = numStr[i] + result;
    count++;
    if (count % 3 === 0 && i !== 0)
      result = "," + result;

  }

  if (isNegative) 
    result = "-" + result;
  
  if (decimalPart) 
    result += decimalPart;

  return result;
}
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */