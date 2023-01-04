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

  // Handle toggle and its content
  checkToggle();

  // Add version to footer
  document.getElementById("version").innerHTML = version;

  // Add year to footer
  let time = new Date();
  let year = time.getFullYear();
  document.getElementById("year").innerHTML = year;

  // Build function for adding event listeners
  const addClickEvent = function(element, handler) {
    element.addEventListener('click', handler);
  }
  
  // Add general event listeners
  addClickEvent(share, sharePage);
  addClickEvent(toggle, checkToggle);
  addClickEvent(generateAuto, handleAuto);
  addClickEvent(generateManual, handleManual);
  addClickEvent(manualCopy, copyClipboard);
  addClickEvent(autoReset, function() { resetContent('auto'); });
  addClickEvent(manualReset, function() { resetContent('manual'); });
  addClickEvent(autoClose, function() { closeMsg('auto-error'); });
  addClickEvent(manualClose, function() { closeMsg('manual-error'); });

  // Add event listeners for opened details
  let details = document.querySelectorAll("details");
  for (var i = 0; i < details.length; i++) {
    addClickEvent(details[i], function() { closeDetails(this); });
  }

};



/**
 * Check toggle state and prepare content
 * 
 * @function checkToggle
 * 
 */
let checkToggle = function() {

  // Define variables
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

  // Prepare content for toggle state
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
 * @async
 * @function sharePage
 * @throws {error} When the share api isn't available or the share fails
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
 * @async
 * @function closeDetails
 * @param current Details part that was opened finally
 * @returns {promise} Leave function whenn current details part is opened
 * 
 */
closeDetails = async (current) => {

  if (current.hasAttribute('open')) return;

  let details = document.querySelectorAll("details");

  for (let i = 0; i < details.length; i++) {
    if (details[i] != current) {
      details[i].open = false;
    }
  }

  await new Promise(resolve => setTimeout(resolve, 100));
  scrollPage(current);

};



/**
 * Scroll to a specific element
 * 
 * @function scrollPage
 * @param element Selector of the element for scrolling to
 * @alternative window.scrollTo(0, current.offsetTop - 70);
 * 
 */
scrollPage = (element) => {

  let targetY = element.offsetTop - 70;
  let currentY = window.pageYOffset;
  let step = (targetY - currentY) / 20;

  let intervalId = setInterval(function() {
    currentY += step;
    window.scrollTo(0, currentY);
    if (step > 0 && currentY >= targetY || step < 0 && currentY <= targetY) {
      clearInterval(intervalId);
    }
  }, 10);
  
};




/**
 * Handle progress for auto generating
 * 
 * @function handleAuto
 * 
 */
handleAuto = () => {

  // Check completeness
  let title = document.getElementById('auto-title');
  let text = document.getElementById('auto-text');

  if ( !checkContent([title, text]) ) {
    document.getElementById('auto-error').style.display = 'block';
    return;
  }

  // Close error message
  closeMsg('auto-error');

  // Check and prepare interval
  let interval = document.getElementById('auto-interval').value;
  interval = Math.round(interval);
  if (interval < 2) interval = 2;

  // Prepare content
  let content = '::';
  let prefixCheck = document.getElementById('prefix').checked;
  if (prefixCheck) content += prefix;
  content += title.value + '::' + generateOutput(text.value, interval);
  let filename = prefix + title.value;

  // Start download
  downloadQuiz(content, filename);

};



/**
 * Handle progress for manual generating
 * 
 * @function handleManual
 * 
 */
handleManual = () => {

  // Check completeness
  let text = document.getElementById('manual-text');

  if ( !checkContent([text]) ) {
    document.getElementById('manual-error').style.display = 'block';
    return;
  }

  // Close error message
  closeMsg('manual-error');

  // Check and prepare interval
  let interval = document.getElementById('manual-interval').value;
  interval = Math.round(interval);
  if (interval < 2) interval = 2;

  // Create content
  let content = generateOutput(text.value, interval);
  document.getElementById('ct-gaptext').value = content;
  copyClipboard();

};



/**
 * Check text content of necessary inputs
 * 
 * @function checkContent
 * @param {array} stringArray All necessary inputs
 * @returns {boolean} Check State of text content
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
 * @returns output Modified text
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
 * @returns Modified element
 * 
 * @hint For words with an odd number of letters, the gap gets larger by using Math.floor()
 * @hint Maybe an option to choose the Math.ceil() method was useful
 * 
*/
prepareGap = (element) => {

  let halfLength = element.length % 2 == 1 
    ? Math.floor(element.length / 2) 
    : element.length / 2;
  let firstHalf = element.substring(0, halfLength);
  let secondHalf = element.substring(halfLength);
  
  return firstHalf + "{1:SA:=" + secondHalf + "}";

};


/**
 * Round letters up or down
 * 
 * @function roundLetters
 * @param {number} x Number of letters for rounding
 * @returns Rounded letters
 * 
 * @todo Used for later, there are a few things to do:
 * Add a select field within the html part
 * Implement call in the prepareGap(element) function
 * Lead auto or manual generating mode through the functions
 * 
*/
roundLetters = (x) => {

  const method = round.value;

  switch (method) {
    case "floor":
      return Math.floor(x);
    case "ceil":
      return Math.ceil(x);
    case "random":
      return Math.random() < 0.5 ? Math.floor(x) : Math.ceil(x);
  }

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