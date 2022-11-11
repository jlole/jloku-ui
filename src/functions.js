export function calculateNextTile( selectedTile, key ) {
  if ( ['ArrowLeft','a'].includes(key) ) {
    if ( selectedTile % 5 === 0 ) {
      return selectedTile + 4;
    } else {
      return selectedTile - 1;
    }
  } else if ( ['ArrowRight','d'].includes(key) ) {
    if ( selectedTile % 5 === 4 ) {
      return selectedTile - 4;
    } else {
      return selectedTile + 1;
    }
  } else if ( ['ArrowUp','w'].includes(key) ) {
    if ( selectedTile < 5 ) {
      return selectedTile + 20;
    } else {
      return selectedTile - 5;
    }
  } else if ( ['ArrowDown','s'].includes(key) ) {
    if ( selectedTile > 19 ) {
      return selectedTile - 20;
    } else {
      return selectedTile + 5;
    }
  }
}

export function getApiGameUrl (difficulty) {
  if (difficulty === 'daily') {
    return '/api/get-daily-puzzle';
  } else {
    return '/api/get-new-puzzle?difficulty=' + difficulty;
  }
}

export function formatDate (date, sep='-') {
  return [
    (date.getDate()).toString().padStart(2, '0'),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getFullYear(),
  ].join(sep);
}

export function visualTime (seconds) {
  let visualMinutes = Math.floor(seconds / 60);
  let visualSeconds = seconds - visualMinutes * 60;
  return visualMinutes + ':' + visualSeconds.toString().padStart(2, '0');
}

// eslint-disable-next-line
String.prototype.replaceAt = function(index, replacement) {
  replacement = replacement + ''
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}
