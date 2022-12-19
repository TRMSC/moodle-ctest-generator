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
let words = sentences.match(/[\w']+|[^\s\w']+/g);

for (let j = 0; j < words.length; j++) {
  if (j % 3 == 2 && words[j].match(/^[\w']+$/)) {
    if (words[j].length % 2 == 1) {
      let halfLength = Math.ceil(words[j].length / 2);
      let firstHalf = words[j].substring(0, halfLength);
      let secondHalf = words[j].substring(halfLength + 1);
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
};
