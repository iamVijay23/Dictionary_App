// Selecting DOM elements
let input = document.querySelector("#input");
let searchBtn = document.querySelector("#searchBtn");
let notFound = document.querySelector("#notFound");
let def = document.querySelector(".def");
let audioBox = document.querySelector(".audio");
let loading = document.querySelector(".loading");
let copyBtn = document.querySelector("#copy-btn");

// API key for accessing the Merriam-Webster Dictionary API
let apiKey = "66f7014d-d83e-41f7-adc8-6b590ef46bf8";

// Event listener for the search button
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // Getting the word from the input field
  let word = input.value;

  // Check if the input is empty
  if (word === "") {
    alert("Please write something");
    return;
  }

  // Perform API call to get data for the entered word
  getData(word);

  // Clearing The Data after 60 seconds

  audioBox.innerHTML = "";
  notFound.innerText = "";
  def.innerText = "";
  copyBtn.style.display = "none";
});

// Function to fetch data from the Merriam-Webster Dictionary API
async function getData(word) {
  // Display loading indicator
  loading.style.display = "block";

  // API call to fetch data for the entered word
  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`
  );

  // Parsing the response JSON
  const data = await response.json();

  // Check if the returned data is empty
  if (!data.length) {
    // Hide loading indicator and display a message if no matches found
    loading.style.display = "none";
    notFound.innerText = "No Matches Found";
    return;
  }

  // If the result is suggestions
  if (typeof data[0] === "string") {
    // Hide loading indicator
    loading.style.display = "none";

    // Display a heading for suggestions
    let heading = document.createElement("h3");
    heading.innerText = "Did you mean";
    notFound.appendChild(heading);

    // Display each suggestion
    data.forEach((element) => {
      let suggestions = document.createElement("span");
      suggestions.className = "suggestions";
      suggestions.innerText = element;
      notFound.appendChild(suggestions);
    });
    return;
  }

  // If a result is found
  // Hide loading indicator
  loading.style.display = "none";
  copyBtn.style.display = "block";
  // Get the definition and display it
  let definition = data[0].shortdef[0];
  def.innerText = definition;

  // Get the sound name and render the audio element
  const soundName = data[0].hwi.prs[0].sound.audio;
  if (soundName) {
    renderSound(soundName);
  }
}

// Function to render the audio element
function renderSound(soundName) {
  // Construct the URL for the audio file
  let subFolder = soundName.charAt(0);
  let soundSrc = ` https://media.merriam-webster.com/audio/prons/en/us/mp3/${subFolder}/${soundName}.mp3?key=${apiKey}`;

  // Create an audio element and set its attributes
  let audio = document.createElement("audio");
  audio.src = soundSrc;
  audio.controls = true;

  // Append the audio element to the audioBox
  audioBox.appendChild(audio);
}

// As The CopyBtn is clicked
// Add an event listener to the "copyBtn" button
copyBtn.addEventListener("click", function () {
  // Check if the 'def' element exists
  if (!def) {
    console.error("Element 'def' not found");
    return;
  }

  // Create a range and select the text content of the 'def' element
  let range = document.createRange();
  range.selectNode(def);

  // Get the current selection and remove any existing ranges
  let selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  // Execute the copy command
  document.execCommand("copy");

  // Deselect the text
  selection.removeAllRanges();

  // Display a Toast Notification using Toastify
  Toastify({
    text: "Text Copied",  // Message to display in the toast
    gravity: "top", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`     
  }).showToast();
});
