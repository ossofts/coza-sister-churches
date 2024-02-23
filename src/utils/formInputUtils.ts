// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeNumberValue = (e: any, includePeriod = true, max?: number) => {
  const newValue = e.target.value.replace(includePeriod ? /[^0-9.]/g : /[^0-9]/g, "") as string;

  // restrict max numbers
  if (max && parseFloat(newValue) > max) {
    // const itms = newValue.split("");
    // itms.pop();
    // e.target.value = itms.join("");
    e.target.value = max;
    return;
  }

  if (newValue.indexOf(".") >= 0) {
    e.target.value =
      newValue.substr(0, newValue.indexOf(".")) + newValue.substr(newValue.indexOf("."), 3);
  } else {
    e.target.value = newValue;
  }
};
