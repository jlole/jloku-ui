export function convertTableToArray( tableSelector ) {
  document.querySelector( tableSelector )
  return 
}

export function puzzle_row_is_valid() {}

export function puzzle_col_is_valid() {}

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

String.prototype.replaceAt = function(index, replacement) {
  replacement = replacement + ''
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}
