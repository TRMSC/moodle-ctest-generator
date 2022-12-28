/**
 * Define const variables
 * 
 * @param {string} prefix Used for the filename and if checked for the question designation
 * @param {array} shareData Site information for share method
 *
 */
const prefix = 'ctest-';
const shareData = {
  title: 'Moodle C-Test Generator | TRMSC',
  text: 'C-Test Generator für Moodle | TRMSC',
  url: window.location
}



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
  share.addEventListener('click', sharePage);
  toggle.addEventListener('click', checkToggle);
  generateAuto.addEventListener('click', handleAuto);
  generateManual.addEventListener('click', handleManual);
  manualCopy.addEventListener('click', copyClipboard);
  autoReset.addEventListener('click', function() { resetContent('auto'); });
  manualReset.addEventListener('click', function() { resetContent('manual'); });
  autoClose.addEventListener('click', function() { closeMsg('auto-error'); });
  manualClose.addEventListener('click', function() { closeMsg('manual-error'); });

  // event listener for opened details
  let details = document.querySelectorAll("details");
  for (var i = 0; i < details.length; i++) {
    details[i].addEventListener("click", function() {
      closeDetails(this);
    });
  }

};



/**
 * Check toggle state and prepare content
 * 
 * @function checkToggle
 * 
 */
let checkToggle = function() {

  let checkbox = document.getElementById('toggle');
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
 * Share page by using the share api
 * 
 * @function sharePage
 * 
 */
sharePage = async () => {

  try {
    await navigator.share(shareData);
    console.log('Shared successfully');
  } catch (err) {
    console.log(`Error: ${err}`);
  }
  
};


/**
 * Close all other details part if another will be opened
 * 
 * @function closeDetails
 * @param current Details part that was opened finally
 * 
 */
closeDetails = (current) => {

  let details = document.querySelectorAll("details");

  for (let i = 0; i < details.length; i++) {
    if (details[i] != current) {
      details[i].open = false;
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

  // create content
  let content = generateOutput(text.value, interval);
  document.getElementById('ct-gaptext').value = content;
  copyClipboard();

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