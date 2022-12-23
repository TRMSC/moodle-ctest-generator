const prefix = 'ctest-';



/**
 * Prepare page
 * 
 * @event
 * @listens onload
 * @class window 
 *
 */
window.onload = () => {

  // handle toggle and its content
  checkToggle();

  // add version to footer
  document.getElementById("version").innerHTML = version;

  // add year to footer
  let time = new Date();
  let year = time.getFullYear();
  document.getElementById("year").innerHTML = year;

  // add event listeners
  document.getElementById('autogenerate').addEventListener('click', checkToggle);
  document.getElementById('generate-auto').addEventListener('click', handleAuto);
  document.getElementById('generate-manual').addEventListener('click', handleManual);
  document.getElementById('manual-copy').addEventListener('click', copyClipboard);
  document.getElementById('auto-reset').addEventListener('click', function() { resetContent('auto'); });
  document.getElementById('manual-reset').addEventListener('click', function() { resetContent('manual'); });
  document.getElementById('auto-close').addEventListener('click', function() { closeMsg('auto-error'); });
  document.getElementById('manual-close').addEventListener('click', function() { closeMsg('manual-error'); });

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
 * Handle progress for auto generating
 * 
 * @function handleAuto
 * 
 */
handleAuto = () => {

  // check completeness
  let title = document.getElementById('auto-title');
  let text = document.getElementById('auto-text');

  if ( !checkContent([title, text]) ) {
    document.getElementById('auto-error').style.display = 'block';
    return;
  }

  // close error message
  closeMsg('auto-error');

  // check and prepare interval
  let interval = document.getElementById('auto-interval').value;
  interval = Math.round(interval);
  if (interval < 2) interval = 2;

  // prepare content
  let content = '::';
  let prefixCheck = document.getElementById('prefix').checked;
  if (prefixCheck) content += prefix;
  content += title.value + '::' + generateOutput(text.value, interval);
  let filename = prefix + title.value;

  // start download
  downloadQuiz(content, filename);

};



/**
 * Handle progress for manual generating
 * 
 * @function handleManual
 * 
 */
handleManual = () => {

  // check completeness
  let text = document.getElementById('manual-text');

  if ( !checkContent([text]) ) {
    document.getElementById('manual-error').style.display = 'block';
    return;
  }

  // close error message
  closeMsg('manual-error');

  // check and prepare interval
  let interval = document.getElementById('manual-interval').value;
  interval = Math.round(interval);
  if (interval < 2) interval = 2;

};



/**
 * Check text content of necessary inputs
 * 
 * @function checkContent
 * @param {array} stringArray All necessary inputs
 * @return {boolean} check State of text content
 * 
 */
checkContent = (stringArray) => {
  let check = true;
  for (let i = 0; i < stringArray.length; i ++) {
      if (stringArray[i].value === '') check = false;
  }
  return check;
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
 * @return Modified element
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
 * @param {string} input Content for putting into the download file
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



/**
 * Copy the content of the textarea to the clipboard
 * 
 * @function copyClipboard
 * 
 */
copyClipboard = () => {

  document.getElementById('ct-gaptext').select();
  document.execCommand('copy');
  let content = document.getElementById("clipboardInfo");
  setTimeout(function () {
    content.classList.add("clipboardConfirm");
  }, 50)
  setTimeout(function () {
    content.classList.remove("clipboardConfirm");
    document.getSelection().removeAllRanges();
  }, 1400)

};



/**
 * Close infobox for errors
 * 
 * @function closeMsg
 * @param item Id for the item to close
 * 
 */
closeMsg = (item) => {
  document.getElementById(item).style.display = 'none';
};



/**
 * Reset content for corresponding mode
 * 
 * @function resetContent
 * @param mode Handle auto or manual content
 */
resetContent = (mode) => {

  if (mode === 'auto') {
    closeMsg('auto-error');
    document.getElementById('prefix').checked = 'true';
    document.getElementById('auto-title').value = '';
    document.getElementById('auto-text').value = '';
    document.getElementById('auto-interval').value = '3';
  } else if (mode === 'manual') {
    closeMsg('manual-error');
    document.getElementById('manual-text').value = '';
    document.getElementById('ct-gaptext').value = '';
    document.getElementById('manual-interval').value = '3';
  } 

};