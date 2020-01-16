const _MS_PER_SEC = 1000;
// console.log("MESSAGEITEM RENDERED!!!")
export default function timeConverter(a, b) {
  // Discard the time and time-zone information.
  let utc1 = new Date(`${a}`);
  let utc2 = new Date(`${b}`);

  let secondsValue = Math.floor((utc2 - utc1) / _MS_PER_SEC);
  if (secondsValue > 63072000)
    return `${Math.floor(secondsValue / (60 * 60 * 24 * 365))} years ago`;
  if (secondsValue > 31536000) return `one year ago`;
  if (secondsValue > 5184000)
    return `${Math.floor(secondsValue / (60 * 60 * 24 * 30))} months ago`;
  if (secondsValue > 2592000) return `one month ago`;
  if (secondsValue > 1209600)
    return `${Math.floor(secondsValue / (60 * 60 * 24 * 7))} weeks ago`;
  if (secondsValue > 604800) return `one week ago`;
  if (secondsValue > 172800)
    return `${Math.floor(secondsValue / (60 * 60 * 24))} days ago`;
  if (secondsValue > 86400) return `one day ago`;
  if (secondsValue > 7200)
    return `${Math.floor(secondsValue / (60 * 60))} hours ago`;
  if (secondsValue > 3600) return `one hour ago`;
  if (secondsValue > 120)
    return `${Math.floor(secondsValue / 60)} minutes ago`;
  if (secondsValue > 60) return `one minute ago`;
  if (secondsValue < 2) return `just now`;
  else return `${secondsValue} seconds ago`;
}