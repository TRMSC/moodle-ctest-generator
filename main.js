/**
 * Generate text
 * 
 * @function generateText
 * @param {string} text
 * 
*/
generateText = (text) => { 
  const subindex = text.search(/[.?!]/);
  let output = text.substring(0, subindex + 1);
  let sentences = text.substring(subindex + 1);
  let words = sentences.split(" ");
  
  for (let j = 0; j < words.length; j++) {
    if (j % 2 == 1) {
      let halfLength = Math.ceil(words[j].length / 2);
      let firstHalf = words[j].substring(0, halfLength);
      let secondHalf = words[j].substring(halfLength);
      output += firstHalf + "{" + (j + 1) + ":SHORTANSWER:=" + secondHalf + "} ";
    } else {
      output += words[j] + " ";
    }
  }
  console.log(output);
};
