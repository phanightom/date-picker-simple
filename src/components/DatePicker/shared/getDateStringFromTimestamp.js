const getDateStringFromTimestamp = timestamp => {
  let dateObject = new Date(timestamp);
  let month = dateObject.getMonth() + 1;
  let date = dateObject.getDate();
  return dateObject.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
}

export default getDateStringFromTimestamp;