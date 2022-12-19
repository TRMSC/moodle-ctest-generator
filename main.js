/**
 * Generate text
 * 
 * @function generateText
 * @param {string} text
 * 
*/
generateText = (text) => { 
  let sentences = text.split(/[.?!]/);
  console.log(sentences[0]);

  for (let i = 1; i < sentences.length; i++) {
    let words = sentences[i].split(" ");
  
    for (let j = 0; j < words.length; j++) {
      if (j % 3 == 2) {
        var halfLength = Math.floor(words[j].length / 2);
        var firstHalf = words[j].substring(0, halfLength);
        var secondHalf = words[j].substring(halfLength);
        console.log(firstHalf + "{" + (j + 1) + ":SHORTANSWER:=" + secondHalf + "} ");
      } else {
        console.log(words[j] + " ");
      }
    }
    //console.log(".");
  }
};
