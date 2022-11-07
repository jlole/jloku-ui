export function getApiGameUrl( difficulty ) {
  if ( difficulty === 'daily' ) {
    return '/api/get_daily_board'
  } else if ( difficulty === 'test' ) {
    return '/api/test'
  } else {
    return '/api/generate_board?difficulty=' + difficulty
  }
}

export function numberIsFullyUsed( number ) {
  return false
}

// eslint-disable-next-line
String.prototype.replaceAt = function(index, replacement) {
  replacement = replacement + ''
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}
