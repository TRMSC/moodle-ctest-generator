/**
 * Generate output from text
 * 
 * @function generateOutput
 * @param {string} text Content to prepare for the output
 * @param {number} count Spacing of the seperated words
 * @return output Modified text
 * 
*/
generateOutput = (text, count) => { 
  const subindex = text.search(/[.?!]/);
  let output = text.substring(0, subindex + 1) + " ";
  let sentences = text.substring(subindex + 1);
  let words = sentences.match(/[\wÄäÖöÜü'\n]+|[^\s\w']+/g);

  for (let i = 0; i < words.length; i++) {
    if (words[i] === "\n") {
      output += "\n";
    } else {
      if (i % count == count - 1 && words[i].match(/^[\w']+$/)) {
        if (words[i].length % 2 == 1) {
          let halfLength = Math.ceil(words[i].length / 2);
          let firstHalf = words[i].substring(0, halfLength);
          let secondHalf = words[i].substring(halfLength + 1);
          secondHalf.length === 0 ? secondHalf = words[i].substring(halfLength) : null;
          output += firstHalf + "{1:SA:=" + secondHalf + "} ";
        } else {
          let halfLength = words[i].length / 2;
          let firstHalf = words[i].substring(0, halfLength);
          let secondHalf = words[i].substring(halfLength);
          output += firstHalf + "{1:SA:=" + secondHalf + "} ";
        }
      } else {
        output += words[i] + " ";
        output = output.replace(/\s+([.?!])/g, "$1");
      }
    }
  }
  return output;
};


/**
 * Download quiz
 * 
 * @function downloadQuiz
 * @param {string} input Content to put into thw download file
 * @param {string} filename Designation for the quiz file
 * 
*/
downloadQuiz = (input, filename) => { 
  let blob = new Blob([input], {type:'text/plain'});
  let a = document.createElement("a");
  a.download = filename + '.txt';
  a.href = window.URL.createObjectURL(blob);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
