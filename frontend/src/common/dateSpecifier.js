const CurrentDate = () => {
  let date = new Date();
  let currentDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return currentDate;
};

export default CurrentDate;
