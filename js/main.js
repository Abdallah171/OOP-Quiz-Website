// https://opentdb.com/api.php?amount=5&category=21&difficulty=easy&type=multiple

//get all elements 
let form = document.getElementById('quizOptions')
let categoryMenu = document.getElementById('categoryMenu')
let difficultyLevel = document.getElementById('difficultyOptions')
let questionsNumber = document.getElementById('questionsNumber')
let startBtn = document.getElementById('startQuiz')
let allQuestions;
let myRow = document.querySelector('.questions .container .row')
let myQuiz;


startBtn.addEventListener('click', async function() {
    let category = categoryMenu.value;
    let difficulty = difficultyLevel.value;
    let Qnumbers = questionsNumber.value;

    myQuiz = new Quiz(category, difficulty, Qnumbers)
    allQuestions = await myQuiz.getAllQuestions()
        // console.log(allQuestions);

    let myQuestion = new Question(0)
    form.classList.replace('d-flex', 'd-none')
    myQuestion.display()


})

class Quiz {
    constructor(category, difficulty, Qnumbers) {
        this.category = category;
        this.difficulty = difficulty;
        this.Qnumbers = Qnumbers;
        this.score = 0;
    }
    getApi() {
        return `https://opentdb.com/api.php?amount=${this.Qnumbers}&category=${this.category}&difficulty=${this.difficulty}&type=multiple`
    }
    async getAllQuestions() {
        let response = await fetch(this.getApi())
        let data = await response.json()
        return data.results
    }

    showResult() {
            return `
      <div
        class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3"
      >
        <h2 class="mb-0">
             ${this.score==this.Qnumbers 
                ? `CONGRATSS` 
                : `YOUR SCORE IS = ${this.score} of ${this.Qnumbers}`
            }
        </h2>
        <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
      </div>
    `;
    }
}

class Question {

    constructor(index) {
        this.index = index
        this.question = allQuestions[index].question
        this.difficulty = allQuestions[index].difficulty
        this.category = allQuestions[index].category
        this.correctAns = allQuestions[index].correct_answer
        this.type = allQuestions[index].type
        this.incorrectAns = allQuestions[index].incorrect_answers
        this.allAnswersArr = this.getAllAnswers()
        this.isAnswered = false;
    }
    getAllAnswers() {
        let allAnswers = [...this.incorrectAns, this.correctAns];
        allAnswers.sort();
        return allAnswers
    }

    display() {
            const questionMarkUp = `
      <div
        class="question shadow-lg col-lg-6 offset-lg-3  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn"
      >
        <div class="w-100 d-flex justify-content-between">
          <span class="btn btn-category">${this.category}</span>
          <span class="fs-6 btn btn-questions">${this.index+1} of ${allQuestions.length}</span>
        </div>
        <h2 class="text-capitalize h4 text-center">${this.question}</h2>  
        <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
        ${this.allAnswersArr.map((answer)=>`<li>${answer}</li>`).toString().replaceAll(',','')}
        </ul>
        <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score:${myQuiz.score}</h2>
      </div>
    `;
        myRow.innerHTML = questionMarkUp;
        let allChoices=document.querySelectorAll('.choices li')
      
        allChoices.forEach((choice)=>{
            choice.addEventListener('click',()=> {
             this.checkAnswer(choice);

             this.NewQuestion() 
           })
        })
console.log(this.correctAns);
    }

    checkAnswer(choise){
        if(!this.isAnswered){

        this.isAnswered=true;

        
        if(choise.innerHTML==this.correctAns)
        {
            ++myQuiz.score    
             choise.classList.add('correct')
        }
   
        else{
            choise.classList.add('wrong')

        }

        }
    
        }
        
        NewQuestion(){
            this.index++

    setTimeout(()=>{
        if(this.index < allQuestions.length){
            let myNewQuestion = new Question(this.index)
            myNewQuestion.display();
        }
   else{

    let result = myQuiz.showResult()
    myRow.innerHTML=result;
    document.querySelector('.again').addEventListener('click',function(){
        window.location.reload();
    })
}
    },500);
        }
            
    }