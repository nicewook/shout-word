var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var start = ["동물", "탈것", "먹을것"];
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
function start() {
  console.log("start()");
  recognition.start();

  hints.innerHTML = `<b>"동물, 탈것, 먹을것"</b>`;
  diagnostic.textContent = "";
  result.innerHTML = "원하는 문제를 말해보세요";
}

function startProblem() {
  document.id.action = "problem.html";
  document.id.submit();
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

  if (spokenWord == "동물" || spokenWord == "탈것" || spokenWord == "먹을것") {
    // start condition
    console.log("시작합니다");
    hintsMsg = "<b>" + spokenWord + "</b>";
    resultMsg = "곧 문제가 시작됩니다";
    hints.innerHTML = hintsMsg;
    result.innerHTML = resultMsg;
    // displayResult();

    setTimeout(function () {
      startProblem();
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
      start();
    }, 1000);
    return;
  }
};

recognition.onerror = function (event) {
  msg = "못알아 들었습니다";
  result.innerHTML = msg;

  errMsg = `<p style="font-size:10px">` + event.error + "</p>";
  errorMessage.innerHTML = errMsg;
  console.log(errMsg);
};

recognition.onspeechend = function () {
  recognition.stop();
};
