const someWords = ['dog', 'cat', 'word', 'yomama', 'yograndmama'];

function getWord(array){
  let aWord = array[Math.floor(Math.random() * array.length)];
  return aWord;
}

module.exports = {
  listOfWords : someWords,
  randomWord : getWord
}
