/**
 * Generate output from text
 * 
 * @function generateOutput
 * @param {string} text Content to prepare for the output
 * @param {number} count Spacing of the seperated words
 * @return output Mdified text
 * 
*/
generateOutput = (text, count) => { 
  const subindex = text.search(/[.?!]/);
  let output = text.substring(0, subindex + 1) + " ";
  let sentences = text.substring(subindex + 1);
  let words = sentences.match(/[\w']+|[^\s\w']+/g);

  for (let j = 0; j < words.length; j++) {
    if (j % count == count - 1 && words[j].match(/^[\w']+$/)) {
      if (words[j].length % 2 == 1) {
        let halfLength = Math.ceil(words[j].length / 2);
        let firstHalf = words[j].substring(0, halfLength);
        let secondHalf = words[j].substring(halfLength + 1);
        secondHalf.length === 0 ? secondHalf = words[j].substring(halfLength) : null;
        output += firstHalf + "{1:SHORTANSWER:=" + secondHalf + "} ";
      } else {
        let halfLength = words[j].length / 2;
        let firstHalf = words[j].substring(0, halfLength);
        let secondHalf = words[j].substring(halfLength);
        output += firstHalf + "{1:SHORTANSWER:=" + secondHalf + "} ";
      }
    } else {
      output += words[j] + " ";
      output = output.replace(/\s+([.?!])/g, "$1");
    }
  }
  console.log(output);
  return output;
};
