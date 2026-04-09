//select elements
let bullets = document.querySelector(".bullets");
let infoArea = document.querySelector(".quiz-info");
let quesArea = document.querySelector(".questions-area");
let question = document.querySelector(".question");
let answersArea = document.querySelector(".answers-area");
let chooseQuiz = document.querySelector("#selected");
let startQuiz = document.querySelector(".start");
let submitBtn = document.querySelector(".sub-answer");
let result = document.querySelector(".result");
let bulletsArea = document.querySelector(".bullets-area");
let quizContaner = document.querySelector(".quiz-app");
let darkButton = document.getElementById("toggle-dark")
let homeBtn = document.querySelector(".home")
//setting
let currentIndex = 0;
let score = 0;
let countDown;
let duration = 5;
////////////////
// Dark mood ////
if (localStorage.getItem("theme") === "dark-mode") {
  darkButton.textContent="🔆"
  document.body.classList.add("dark-mode");
}
darkButton.onclick= () => {
  document.body.classList.toggle("dark-mode")
  darkButton.textContent="🔆"
  if(document.body.classList.contains("dark-mode")){
  localStorage.setItem("theme","dark-mode");
  
}else{
  localStorage.removeItem("theme")
  darkButton.textContent="🌙"
  
}
};
//////////////////////////
//fetch data
startQuiz.onclick = () => {
  quizContaner.style.cssText = "opacity:1";
  chooseQuiz.style.cssText = "display:none";
  startQuiz.style.cssText="display:none"
  ////////////////
  //fetch Api
  fetch("Data.json")
    .then((res) => res.json())
    .then((res) => {
      //main variables
      let count = res[`${chooseQuiz.value}`].length;
    
      //create bullets and quiz info
      bullets.innerHTML = "";
      createBullets(count, res[`${chooseQuiz.value}`][0].category);

      //get questions from api
      question.innerHTML = "";
      answersArea.innerHTML = "";
      getQuestions(res[chooseQuiz.value][currentIndex], count);
      ///timer of questions
      timer(duration);
      ////////////////
      //submit answer//
      submitBtn.addEventListener("click", () => {
        let rightAnswer = res[`${chooseQuiz.value}`][currentIndex].right_answer;
        //bullets style => if answer correct or wrong
        styleBullets(count, rightAnswer);
        ///checkright answers
        checkAnswer(rightAnswer, count);
        currentIndex++;
        if (currentIndex < count) {
          question.innerHTML = "";
          answersArea.innerHTML = "";
          getQuestions(res[chooseQuiz.value][currentIndex], count);
          //timer of next question
          clearInterval(countDown);
          timer(duration);
        } else {
          backHome();
          showScore(score, count);

        }
      });
// end of submit answer
    });
};

//Go to Home 



//all functions
//[1] create bullets
function createBullets(count, Category) {
  infoArea.innerHTML = `
     <span>Category:${Category}</span>
        <span>question number:${count}</span>
    `;
  for (let i = 0; i < count; i++) {
    let bullet = document.createElement("span");

    bullets.appendChild(bullet);
  }
}

//[2] get questions from api
function getQuestions(obj, count) {
  let myQuestion = document.createElement("h3");
  myQuestion.textContent = obj.title;

  question.appendChild(myQuestion);

  //create answers
  for (let i = 1; i <= 4; i++) {
    //create answer div
    let divAnswer = document.createElement("div");
    divAnswer.className = "answer";
    //create input radio
    let radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "option";
    radioInput.id = i;
    radioInput.dataset.answer = obj[`answer_${i}`];
    if (i == 1) {
      radioInput.checked = true;
    }
    // create label
    let mylabel = document.createElement("label");
    mylabel.htmlFor = i;
    mylabel.textContent = obj[`answer_${i}`];
    //append elements
    divAnswer.appendChild(radioInput);
    divAnswer.appendChild(mylabel);
    answersArea.appendChild(divAnswer);
  }
}

//[3]check rigth answer
function checkAnswer(rigth, count) {
  let checkAnswer = document.getElementsByName("option");
  let selectanswer = null;
  let arr = Array.from(checkAnswer);
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].checked) {
      selectanswer = arr[i].dataset.answer;
    }
  }

  if (selectanswer) {
    if (selectanswer === rigth) {
      console.log(`${selectanswer} : ${rigth}`);
      score++;
    } else {
      console.log("❌ Wrong:", selectanswer, "| Right:", rigth);
    }
  }
}

//[4] show Grade and total score 
function showScore(score, count) {
  //hide all before show result
  submitBtn.remove();
  bulletsArea.remove();
  quesArea.remove();
///
  let percentage = (score / count) * 100;
  if (percentage < 50) {
    result.innerHTML = `
          <p> Grade: <span class="bad">Fail!!</span></p>
          <span>score = ${score}/${count}</span>`;
  } else if (percentage == 50) {
    result.innerHTML = `
            Grade: <span class="pass">Pass</span>
          <span>score = ${score}/${count}</span>`;
  } else if (percentage >= 60) {
    result.innerHTML = `
           Grade:  <span class="good">good</span>
          <span>score = ${score}/${count}</span>`;
  } else if (percentage >= 75) {
    result.innerHTML = `
           Grade:  <span class="verygood">Verygood</span>
          <span>score = ${score}/${count}</span>`;
  } else if (percentage >= 90) {
    result.innerHTML = `
           Grade:  <span class="excellent">Excellent</span>
          <span>score = ${score}/${count}</span>`;
  }
}

//[5]function question timer
function timer(duration) {
  let mintes, seconds;
  countDown = setInterval(() => {
    mintes = parseInt(duration / 60);
    seconds = parseInt(duration % 60);

    mintes = mintes < 10 ? `0${mintes}` : mintes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    //add time to page
    document.querySelector(".timer").innerHTML = `
    ${mintes} : ${seconds}
    `;
    //count down click to get next question
    if (--duration < 0) {
      clearInterval(countDown);
      submitBtn.click();
    }
  }, 1000);
}

////[6]function Ui bullets
function styleBullets(count, rigth) {
  let mybullets = document.querySelectorAll(".bullets span");
  let answerChecked = document.getElementsByName("option");

  // console.log(answerChecked[0].dataset.answer)
  for (let i = 0; i < mybullets.length; i++) {
    if (i == currentIndex) {
      answerChecked.forEach((element) => {
        if (element.checked) {
          if (element.dataset.answer == rigth) {
            mybullets[i].classList.add("correct");
          } else {
            mybullets[i].classList.add("wrong");
          }
        }
      });
    }
  }
}

//back to home 
function backHome(){
  homeBtn.style.display="block"
homeBtn.addEventListener("click",()=>{
  history.go(0)
})

}
