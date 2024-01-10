// Selecting DOM elements
let input = document.querySelector("#input");
let searchBtn = document.querySelector("#searchBtn");
let notFound = document.querySelector("#notFound");
let def = document.querySelector(".def");
let audioBox = document.querySelector(".audio");
let loading = document.querySelector(".loading");

// API key for accessing the Merriam-Webster Dictionary API
let apiKey = "your api key"

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

  // Clearing The Data after 15 seconds
  setTimeout(function () {
    audioBox.innerHTML = "";
    notFound.innerText = "";
    def.innerText = "";
    input.value = " ";
  }, 15000);
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
