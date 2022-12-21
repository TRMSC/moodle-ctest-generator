/**
 * Generate output from text
 * 
 * @function generateOutput
 * @param {string} text Content to prepare for the output
 * @param {number} count Spacing of the seperated words
 * @return output Modified text
 * 
*/
generateOutput = (text, interval) => { 
  const subindex = text.search(/[.?!]/);
  let output = text.substring(0, subindex + 1) + " ";
  let sentences = text.substring(subindex + 1);
  let words = sentences.match(/[\wÄäÖöÜü'\n]+|[^\s\w']+|\s/g);
  let count = 0;

  // handle every array entry
  for (let i = 0; i < words.length; i++) {

    // check if entry is a break, space, special char or a short word
    if (words[i] === "\n" | words[i].length < 2) {
      output += words[i];
    } else {
      count++;

      // check interval and modify
      if (count < interval) {
        output += words[i];
      } else {
        count = 0;
        output += prepareGap(words[i]);
      }

    }

  }
  console.log(output);
  return output;
};


/**
 * Prepare gap
 * 
 * @function prepareGap
 * @param {string} element Content to prepare for the output
 * @return modified element
 * 
*/
prepareGap = (element) => {
  if (element.length % 2 == 1) {
    let halfLength = Math.ceil(element.length / 2);
    let firstHalf = element.substring(0, halfLength);
    let secondHalf = element.substring(halfLength + 1);
    secondHalf.length === 0 ? secondHalf = element.substring(halfLength) : null;
    return firstHalf + "{1:SA:=" + secondHalf + "}";
  } else {
    let halfLength = element.length / 2;
    let firstHalf = element.substring(0, halfLength);
    let secondHalf = element.substring(halfLength);
    return firstHalf + "{1:SA:=" + secondHalf + "}";
  }
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
