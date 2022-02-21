//Catching the query text that comes from index.html via GET method. (?query=word)
const query = window.location.search.split("=")[1];

//Initializing constant request text.
const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const apiRequest = apiUrl + query;

//Initializing the HTML Elements we use.
const wordCard = document.querySelector(".word-card");
const backToHomepage = document.querySelectorAll(".back-to-home");
const word = document.querySelector(".word");
const phonetic = document.querySelector(".phonetic");
const partOfSpeech = document.querySelector(".part-of-speech");
const definition = document.querySelector(".definition");
const example = document.querySelector(".example");
const pronunciation = document.querySelector(".pronunciation");
const speakerIcon = document.querySelector(".pronunciation > img");
const audio = document.querySelector("#audio");
const nothingFound = document.querySelector(".card-404");

//Making HTTP request to the dictionary API.
const xhr = new XMLHttpRequest();
xhr.open("GET", apiRequest);
xhr.send();

xhr.onload = function () {
  if (xhr.status === 200) {
    //If the request is successful

    data = JSON.parse(xhr.response)[0]; //Parsing json data comes from HTTP request (Dictionary API)

    //Setting the data, that comes from API, to the HTML elements.
    word.textContent = data["word"];
    for (i = 0; i < ObjectSize(data["phonetics"]); i++) {
      //This loop will check "phonetics" object whether there is a text of phonetic unless the HTML element, whose tag is "phonetic", has a text.
      phonetic.textContent = data["phonetics"][i]["text"];
      if (phonetic.textContent != "") break;
    }
    for (i = 0; i < ObjectSize(data["phonetics"]); i++) {
      //This loop will work until a valid audio object got found.
      speakerIcon.style.display = "none"; //If there is no audio object, then speakerIcon will be get hidden.
      pronunciation.style.cursor = "default"; // At the same time, if there is no audio cursor will have "default" property.
      if (data["phonetics"][i]["audio"] != "") {
        speakerIcon.style.display = "block";
        pronunciation.style.cursor = "pointer";
        audio.src = data["phonetics"][i]["audio"];
        break;
      }
    }
    partOfSpeech.textContent = data["meanings"][0]["partOfSpeech"];
    definition.textContent =
      data["meanings"][0]["definitions"][0]["definition"];
    if (data["meanings"][0]["definitions"][0]["example"] != undefined) {
      example.innerHTML =
        "<span id='example-icon'>§</span> " +
        data["meanings"][0]["definitions"][0]["example"];
    }
  } else if (xhr.status === 404) {
    //If the HTTP request went wrong:
    //Head the user to "Oops! We couldn't find the vocab." page.
    wordCard.style.display = "none";
    nothingFound.style.display = "block";
  }
};

pronunciation.addEventListener("click", () => {
  audio.play(); //The pronunciation of the word, which the user searched for, will be played.
});

backToHomepage.forEach((back) => {
  // I've used forEach because there are two HTML elements which has "back-to-home" class in the same page.
  back.addEventListener("click", () => {
    document.location.href = "./index.html";
  });
});

function ObjectSize(object) {
  //This function is for finding out the size of any object.
  var length = 0;
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      ++length;
    }
  }
  return length; //returns an integer number.
}
