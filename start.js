var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var start = ["동물", "탈 것", "먹을 것"];
var grammarStart =
  "#JSGF V1.0; grammar start; public <start> = " + start.join(" | ") + " ;";

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammarStart, 1);

recognition.continuous = false;
recognition.lang = "ko-KR"; // 'en-US'
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var hints = document.querySelector(".hints");
var diagnostic = document.querySelector(".output");
var result = document.querySelector(".result");
var errorMsg = document.querySelector(".error-message");

let resultMsg = "";
var wordHTML = "";

// first start
function startGame() {
  console.log("start()");
  hMsg = `<b>동물, 탈 것, 먹을 것</b>`;
  dMsg = "";
  rMsg = "원하는 문제를 말해보세요";
  hints.innerHTML = hMsg;
  diagnostic.innerHTML = dMsg;
  result.innerHTML = rMsg;
  recognition.start();
}

function startAnimalWord() {
  window.location.href = "./animal.html";
}

function startVehicleWord() {
  window.location.href = "./vehicle.html";
}

function startFoodWord() {
  window.location.href = "./food.html";
}

// The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
// The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
// It has a getter so it can be accessed like an array
// The first [0] returns the SpeechRecognitionResult at the last position.
// Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
// These also have getters so they can be accessed like arrays.
// The second [0] returns the SpeechRecognitionAlternative at position 0.
// We then return the transcript property of the SpeechRecognitionAlternative object
recognition.onresult = function (event) {
  let spokenWord = event.results[0][0].transcript;

  if (
    spokenWord == "동물" ||
    spokenWord == "탈 것" ||
    spokenWord == "먹을 것"
  ) {
    // start condition
    console.log("시작합니다");
    hintsMsg = "<b>" + spokenWord + "</b>";
    resultMsg = "곧 문제가 시작됩니다";
    hints.innerHTML = hintsMsg;
    result.innerHTML = resultMsg;
    // displayResult();

    var startWordFunc;
    if (spokenWord == "동물") {
      startWordFunc = startAnimalWord;
    } else if (spokenWord == "탈 것") {
      startWordFunc = startVehicleWord;
    } else {
      startWordFunc = startFoodWord;
    }

    setTimeout(function () {
      startWordFunc();
      // startAnimalWord();
    }, 1000);
    return;
  } else {
    console.log("시작 실패!");
    if (spokenWord !== "") {
      diagnostic.innerHTML = spokenWord;
      resultMsg = "잘못 말하셨어요";
    } else {
      resultMsg = "";
    }
    result.innerHTML = resultMsg;

    setTimeout(function () {
      startGame();
    }, 1000);
    return;
  }
};

recognition.onerror = function (event) {
  msg = "못알아 들었습니다";
  result.innerHTML = msg;

  errMsg = `<p style="font-size:16px">` + event.error + "</p>";
  errorMsg.innerHTML = errMsg;
  console.log(errMsg);
};

recognition.onspeechend = function () {
  recognition.stop();
};
