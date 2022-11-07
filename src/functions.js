export function getApiGameUrl( difficulty ) {
  if ( difficulty === 'daily' ) {
    return '/api/get_daily_board'
  } else if ( difficulty === 'test' ) {
    return '/api/test'
  } else {
    return '/api/generate_board?difficulty=' + difficulty
  }
}

export function formatDate(date) {
  return [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    (date.getDate()).toString().padStart(2, '0'),
  ].join('-');
}

// eslint-disable-next-line
String.prototype.replaceAt = function(index, replacement) {
  replacement = replacement + ''
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}
