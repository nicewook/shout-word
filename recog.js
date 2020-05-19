var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var animal = ["돼지", "개", "고양이", "쥐", "염소", "양", "말", "호랑이", "사자", "사슴", "코끼리", "악어", "기린", "코뿔소", "원숭이", "나무늘보", "고슴도치", "얼룩말", "젖소", "오리",];
var car = ["경찰차", "택시", "버스", "기차", "비행기", "오토바이", "트럭", "불도저", "소방차", "구급차", "헬리콥터", "견인차", "청소차", "포크레인", "자전거", "레미콘", "지하철", "전투기", "지게차", "우주선",];
var food = ["치킨", "김밥", "아이스크림", "멘토스", "젤리", "빵", "계란", "딸기", "케잌", "참외", "수박", "라면", "바나나", "쥬스", "시금치", "어묵", "감자튀김", "포도", "우유", "사탕",];

var grammarAnimal = "#JSGF V1.0; grammar animal; public <animal> = " + animal.join(" | ") + " ;";
var grammarCar = "#JSGF V1.0; grammar car; public <car> = " + car.join(" | ") + " ;";
var grammarFood = "#JSGF V1.0; grammar food; public <food> = " + food.join(" | ") + " ;";

var recognition = new SpeechRecognition();
var speechRecognitionListAnimal = new SpeechGrammarList();
var speechRecognitionListCar = new SpeechGrammarList();
var speechRecognitionListFood = new SpeechGrammarList();
speechRecognitionListAnimal.addFromString(grammarAnimal, 1);
speechRecognitionListCar.addFromString(grammarCar, 1);
speechRecognitionListFood.addFromString(grammarFood, 1);

recognition.continuous = false;
recognition.lang = "ko-KR";  // 'en-US'
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
let resultMsg = "";
var wordHTML = "";

// first start
function start() {
  console.log("start()");
  recognition.start();

  hints.innerHTML = `<b>"동물, 부릉부릉, 냠냠"</b> 중 하나를 외치면 시작합니다`;

  manualMsg = `<div class="card card-body bg-secondary text-white">
    <h5 class="normal w700">게임 방법</h5>
    <p class="normal w400">
      화면에 보이는 단어 또는 숫자를 시간내에 큰 소리로 말했을때에
      말한 단어 또는 숫자가 화면에 나타나며, 이때 두 단어 또는
      숫자가 같으면 정답이다. 다시 게임하려면 현재 단어를 큰소리로
      말하면 된다. 점수는 리셋될 것이다.
    </p>
  </div>`;
  manual.innerHTML = manualMsg;
  diagnostic.textContent = "";

  // initialize
  count = 0;
  rightNum = 0;
  wrongNum = 0;

  result.innerHTML = "";
  right.innerHTML = "";
  wrong.innerHTML = "";
}

function displayResult() {
  result.innerHTML = resultMsg;
  right.innerHTML = "정답개수: " + rightNum;
  wrong.innerHTML = "오답개수: " + wrongNum;
}

let wordKind = "animal"
function prepareAnimal() {
  wordKind = "animal"
  recognition.grammars = speechRecognitionListAnimal;
}

function prepareCar() {
  wordKind = "car"
  recognition.grammars = speechRecognitionListCar;
}

function prepareFood() {
  wordKind = "food"
  recognition.grammars = speechRecognitionListFood;
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

  let spokenWord = event.results[0][0].transcript;

  if (state == "ready") {
    if (spokenWord == "동물" || spokenWord == "부릉부릉" || spokenWord == "냠냠") {  // start condition
      console.log("시작합니다");
      manual.innerHTML = "";  // remove manual

      // reset
      state = "start";
      count = 0;
      rightNum = 0;
      wrongNum = 0;
      resultMsg = "";
      // displayResult();

      if (spokenWord == "동물") {
        prepareAnimal();
      } else if (spokenWord == "부릉부릉") {
        prepareCar();
      } else {  // 냠냠
        prepareFood();
      }

      setTimeout(function () {
        restart();
      }, 1000);
      return;
    } else {
      console.log("시작 실패!");
      if (spokenWord !== "") {
        resultMsg = "</b>" + spokenWord + `</b> 라고 잘못 말하셨어요`;
      } else {
        resultMsg = "";
      }
      hints.innerHTML = resultMsg;

      setTimeout(function () {
        start();
      }, 1000);
      return;
    }
  } else {
    if (spokenWord == currentWord) {
      // if (spokenWord != "시작") {
      //   resultMsg = "정답입니다";
      //   rightNum++;
      // } else {
      //   resultMsg = "";
      // }
      resultMsg = "정답입니다";
      rightNum++;
    } else {
      resultMsg = "오답입니다";
      wrongNum++;
    }
    displayResult();

    diagnostic.textContent = spokenWord;
    count++;
    console.log("Confidence: " + event.results[0][0].confidence);
    if (count >= 10) {
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
  }
};

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

function restart() {
  document.body.style.backgroundColor = "#212529";
  diagnostic.textContent = "";
  recognition.start();
  if (wordKind == "animal") {
    currentWord = animal[Math.floor(Math.random() * animal.length)];
  } else if (wordKind == "car") {
    currentWord = car[Math.floor(Math.random() * car.length)];
  } else {
    currentWord = food[Math.floor(Math.random() * food.length)];
  }
  
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
