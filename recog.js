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
var car = [
  "경찰차",
  "택시",
  "버스",
  "기차",
  "비행기",
  "오토바이",
  "트럭",
  "불도저",
  "소방차",
  "구급차",
  "헬리콥터",
  "견인차",
  "청소차",
  "포크레인",
  "자전거",
  "레미콘",
  "지하철",
  "전투기",
  "지게차",
  "우주선",
];
var food = [
  "치킨",
  "김밥",
  "아이스크림",
  "멘토스",
  "젤리",
  "빵",
  "계란",
  "딸기",
  "케잌",
  "참외",
  "수박",
  "라면",
  "바나나",
  "쥬스",
  "시금치",
  "어묵",
  "감자튀김",
  "포도",
  "우유",
  "사탕",
];

var grammarAnimal =
  "#JSGF V1.0; grammar animal; public <animal> = " + animal.join(" | ") + " ;";
var grammarCar =
  "#JSGF V1.0; grammar car; public <car> = " + car.join(" | ") + " ;";
var grammarFood =
  "#JSGF V1.0; grammar food; public <food> = " + food.join(" | ") + " ;";

var recognition = new SpeechRecognition();
var speechRecognitionListAnimal = new SpeechGrammarList();
var speechRecognitionListCar = new SpeechGrammarList();
var speechRecognitionListFood = new SpeechGrammarList();
speechRecognitionListAnimal.addFromString(grammarAnimal, 1);
speechRecognitionListCar.addFromString(grammarCar, 1);
speechRecognitionListFood.addFromString(grammarFood, 1);

recognition.continuous = false;
recognition.lang = "ko-KR"; // 'en-US'
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var hints = document.querySelector(".hints");
var diagnostic = document.querySelector(".output");
var result = document.querySelector(".result");
var errorMessage = document.querySelector(".error-message");

let count = 0;
var wordMsg = "";
var dMsg = "";
var resultMsg = "";

function restart() {
  prepareAnimal();
  recognition.start();

  currentWord = animal[Math.floor(Math.random() * animal.length)];

  // if (wordKind == "animal") {
  //   currentWord = animal[Math.floor(Math.random() * animal.length)];
  // } else if (wordKind == "car") {
  //   currentWord = car[Math.floor(Math.random() * car.length)];
  // } else {
  //   currentWord = food[Math.floor(Math.random() * food.length)];
  // }

  wordMsg = currentWord;
  dMsg = "";
  rMsg = "";
  hints.innerHTML = wordMsg;
  diagnostic.innerHTML = dMsg;
  result.innerHTML = rMsg;

  console.log("Ready to receive a word.");
}

function displayResult() {
  result.innerHTML = resultMsg;
  diagnostic.innerHTML = dMsg;
}

let wordKind = "animal";
function prepareAnimal() {
  wordKind = "animal";
  recognition.grammars = speechRecognitionListAnimal;
}

function prepareCar() {
  wordKind = "car";
  recognition.grammars = speechRecognitionListCar;
}

function prepareFood() {
  wordKind = "food";
  recognition.grammars = speechRecognitionListFood;
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
  if (spokenWord == currentWord) {
    resultMsg = "정답입니다";
    dMsg = "";
  } else {
    resultMsg = "오답입니다";
    dMsg = spokenWord;
  }
  displayResult();

  count++;
  console.log("Confidence: " + event.results[0][0].confidence);
  if (count >= 10) {
    console.log("10문제 완료");
    setTimeout(function () {
      backToStart();
    }, 2000);
  } else {
    console.log("재시작");
    setTimeout(function () {
      restart();
    }, 1000);
  }
};

function backToStart() {
  window.location.href = "./index.html";
}

recognition.onerror = function (event) {
  msg = "못알아 들었습니다";
  hints.innerHTML = msg;

  // let eMsg = "";
  // if (event.error == "") {
  //   eMsg = "no error";
  // } else {
  //   eMsg = event.error;
  // }
  // if (event.error == "") {
  //   return;
  // }
  errMsg = `<p style="font-size:8px">` + event.error + "</p>";
  errorMessage.innerHTML = errMsg;
  console.log(errMsg);

  // setTimeout(function () {
  //   if (state === "ready") {
  //     errorMessage.innerHTML = "";
  //     start();
  //   } else {
  //     restart();
  //   }
  // }, 3000);
};

recognition.onspeechend = function () {
  recognition.stop();
};

// recognition.onnomatch = function (event) {
//   diagnostic.textContent = "못 알아 들었어요";
// };

// recognition.onerror = function (event) {
//   diagnostic.textContent = "못 알아 들었어요: " + event.error;
// };
