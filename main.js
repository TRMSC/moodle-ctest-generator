/**
 * Prepare page
 * 
 * @event
 * @listens onload
 * @class window 
 *
 */
window.onload = () => {

  // call functions
  // checkToggle();

  // add version to footer
  document.getElementById("version").innerHTML = version;

  // add year to footer
  let time = new Date();
  let year = time.getFullYear();
  document.getElementById("year").innerHTML = year;

};



/**
 * Check toggle state and prepare content
 * 
 * @function checkToggle
 * 
 */
let checkToggle = function() {

  let checkbox = document.getElementById('autogenerate');
  let toggleinfo = document.getElementById('toggleinfo');
  let togglesummary = document.getElementById('togglesummary');

  let infoTrue = 'Automatischer Testfragengenerator ist aktiviert';
  let infoFalse = 'Automatischer Testfragengenerator ist deaktiviert';
  let summaryTrue = 
    'Mithilfe des automatischen Testfragengenerators kann der C-Test ' +
    'direkt erzeugt und heruntergeladen werden.';
  let summaryFalse = 
    'Im Gegensatz zum automatischen Generator wird der C-Test im manuellen ' +
    'Modus nach dem Erstellen per Copy and Paste in Moodle eingefügt.';

  if (checkbox !== null) {
    if (checkbox.checked) {
        toggleinfo.innerHTML = infoTrue;
        togglesummary.innerHTML = summaryTrue;
        document.getElementById('auto').style.display = 'block';
        document.getElementById('manual').style.display = 'none';
    } else {
        toggleinfo.innerHTML = infoFalse;
        togglesummary.innerHTML = summaryFalse;
        document.getElementById('manual').style.display = 'block';
        document.getElementById('auto').style.display = 'none';
    }
  }

};



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
  let output = text.substring(0, subindex + 1);
  let sentences = text.substring(subindex + 1);
  let words = sentences.match(/[\wÄäÖöÜü'\n]+|[^\s\w']+|\s/g);
  let count = 0;

  for (let i = 0; i < words.length; i++) {

    if (words[i] === "\n" | words[i].length < 2) {
      output += words[i];
    } else {
      count++;
      output += count < interval 
        ? words[i] 
        : ( count = 0, prepareGap(words[i]) );
    }

  }

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

  let halfLength = element.length % 2 == 1 
    ? Math.ceil(element.length / 2) 
    : element.length / 2;
  let firstHalf = element.substring(0, halfLength);
  let secondHalf = element.substring(halfLength);
  return firstHalf + "{1:SA:=" + secondHalf + "}";

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
