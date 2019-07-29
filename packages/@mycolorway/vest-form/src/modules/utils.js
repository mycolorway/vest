
export function padString(string, length, padString) {
  if (string.length >= length) {
    return string + ''
  } else {
    var padResult = ''
    for (var i = 0; i < length - string.length; i++) {
      padResult += padString
    }
    return padResult + string
  }
}
