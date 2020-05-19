var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var animal = [
  "돼지",
  "개",
  "고양이",
  "쥐",
  "염소",
  "양",
  "말",
  "호랑이",
  "사자",
  "사슴",
  "코끼리",
  "악어",
  "기린",
  "코뿔소",
  "원숭이",
  "나무늘보",
  "고슴도치",
  "얼룩말",
  "젖소",
  "오리",
];
var grammar =
  "#JSGF V1.0; grammar animal; public <animal> = " + animal.join(" | ") + " ;";

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = "ko-KR";
// recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector(".output");
var bg = document.querySelector("html");
var hints = document.querySelector(".hints");
var result = document.querySelector(".result");
var right = document.querySelector(".right");
var wrong = document.querySelector(".wrong");
var manual = document.querySelector(".manual");
var errorMessage = document.querySelector(".error-message");

let state = "ready";
let count = 0;
let rightNum = 0;
let wrongNum = 0;
let resultOK = false;

var wordHTML = "";
function start() {
  setTimeout(function () {
    recognition.start();

    currentWord = "시작";

    hints.innerHTML = `<b>"시작"</b> 이라고 말해보세요`;

    man = `<div class="card card-body bg-secondary text-white">
    <h5 class="normal w700">게임 방법</h5>
    <p class="normal w400">
      화면에 보이는 단어 또는 숫자를 시간내에 큰 소리로 말했을때에
      말한 단어 또는 숫자가 화면에 나타나며, 이때 두 단어 또는
      숫자가 같으면 정답이다. 다시 게임하려면 현재 단어를 큰소리로
      말하면 된다. 점수는 리셋될 것이다.
    </p>
  </div>`;

    manual.innerHTML = man;

    diagnostic.textContent = "";
    console.log("시작! 하고 말하면 시작한다.");

    count = 0;
    rightNum = 0;
    // right.innerHTML = "";
    wrongNum = 0;
    // wrong.innerHTML = "";
  }, 1000);
}

function displayScore() {
  right.innerHTML = "정답개수: " + rightNum;
  wrong.innerHTML = "오답개수: " + wrongNum;
}

recognition.onresult = function (event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  resultOK = true;
  var spokenWord = event.results[0][0].transcript;

  if (state === "ready") {
    if (spokenWord == currentWord) {
      console.log("시작합니다");

      manual.innerHTML = "";
      state = "start";
      count = 0;
      rightNum = 0;
      wrongNum = 0;
      displayScore();

      setTimeout(function () {
        restart();
      }, 1000);
      return;
    } else {
      console.log("시작하고 제대로 말해요!");
      // diagnostic.textContent = spokenWord;
      if (spokenWord !== "") {
        resultMessage = "</b>" + spokenWord + `</b> 라고 잘못 말하셨어요`;
      } else {
        resultMessage = "";
      }
      hints.innerHTML = resultMessage;

      setTimeout(function () {
        start();
      }, 1000);
      return;
    }
  }
  diagnostic.textContent = spokenWord;
  if (spokenWord === currentWord) {
    if (spokenWorld === "시작") {
      result.innerHTML = "";
    } else {
      result.innerHTML = "정답입니다";
    }
    rightNum++;
    // document.body.style.backgroundColor = "green";
    displayScore();
  } else {
    result.innerHTML = "오답입니다";
    // document.body.style.backgroundColor = "red";
    wrongNum++;
    displayScore();
  }
  count++;
  console.log("Confidence: " + event.results[0][0].confidence);
  // restart();
  // setTimeout(function () {
  //   restart();
  // }, 2000);

  if (count > 10) {
    console.log("10문제 완료");
    setTimeout(function () {
      start();
    }, 2000);
  } else {
    console.log("재시작");
    setTimeout(function () {
      restart();
    }, 1000);
  }
};

recognition.onerror = function (event) {
  msg = "못알아 들었습니다";
  hints.innerHTML = msg;

  errMsg = `<p style="font-size:8px">` + event.error + "</p>";
  errorMessage.innerHTML = errMsg;
  console.log(errMsg);

  setTimeout(function () {
    if (state === "ready") {
      errorMessage.innerHTML = "";
      start();
    } else {
      restart();
    }
  }, 3000);
};

function restart() {
  document.body.style.backgroundColor = "#212529";
  recognition.start();
  currentWord = animal[Math.floor(Math.random() * animal.length)];
  wordHTML = "문제: " + currentWord;

  hints.innerHTML = wordHTML;
  result.innerHTML = "";

  console.log("Ready to receive a word.");
}

recognition.onspeechend = function () {
  recognition.stop();
};

// recognition.onnomatch = function (event) {
//   diagnostic.textContent = "못 알아 들었어요";
// };

// recognition.onerror = function (event) {
//   diagnostic.textContent = "못 알아 들었어요: " + event.error;
// };
