var questions = [];
var currentQuestionIndex = 0;
var userRating = null;
var ratingsArray = [];
var allResponses = [];
var allClicks = [];
var studyTime = 1;
const startStudyTime = new Date().getTime();
const endStudyTime = startStudyTime + studyTime * 60 * 1000;

function readCSV(file, callback) {
    Papa.parse(file, {
        download: true,
        complete: function (result) {
            callback(result.data);
        }
    });
}

function updateTimer() {
    var currentTime = new Date().getTime();
    const remainingTime = endStudyTime - currentTime;
    if (remainingTime <= 0) {
      // Time is up, show the submit button
      displayLastPage();
    } else {
      // Calculate remaining minutes and seconds
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);

      document.getElementById('timer').innerHTML = `Time remaining: ${minutes}m ${seconds}s`;
      setTimeout(updateTimer, 1000); // Update every second
    }
}

function createResponseData(ques, res, question_tag, ratingVal, allClicks, startT, endT, elaspsedT){
    console.log("Question each: " + ques);
    console.log("Res: " + res);
    console.log("Tag: " + question_tag);
    var responseData = {
        question: ques,
        response: res,
        tag: question_tag,
        rating: JSON.stringify(ratingVal),
        clicks: allClicks,
        startT: JSON.stringify(startT),
        endT: JSON.stringify(endT),
        responseT: JSON.stringify(elaspsedT),
    };
    allResponses.push(responseData);
}

function displayLastPage() {
    var submitButton = document.getElementById("submit-btn");
    submitButton.style.display = 'block';
    var endPage = document.getElementById("end-container");
    endPage.innerHTML = "";
    endPage.textContent = "Thank you for participating in the study. Please click on the submit button to finish.";
}

function displayQuestion() {
    var questionContainer = document.getElementById("question-container");
    var optionsContainer = document.getElementById("options-container");
    var nextButton = document.getElementById("next-btn");
    var submitButton = document.getElementById("submit-btn");
    var ratingScale = document.getElementById("rating-scale");

    questionContainer.textContent = questions[currentQuestionIndex].question;
    optionsContainer.textContent = questions[currentQuestionIndex].option;

    ratingScale.innerHTML = "";
    for (let i = 1; i <= 7; i++) {
        var ratingOption = document.createElement("div");
        ratingOption.className = "rating-option";
        ratingOption.textContent = i;

        ratingOption.addEventListener("click", function () {
            userRating = i;
            allClicks.push(userRating);

            // Remove previous selection styling
            document.querySelectorAll('.rating-option').forEach(function (el) {
                el.style.backgroundColor = "";
                if (el.textContent == userRating)
                {
                    el.style.backgroundColor = "#e0e0e0";
                }
            });
        });

        ratingScale.appendChild(ratingOption);
    }

    nextButton.addEventListener("click", function () {
        if (userRating) {
            var endTime = new Date();
            var elapsedTime = endTime - startTime;
            ratingsArray.push(JSON.stringify(userRating));
            var question_tag = JSON.stringify(questions[currentQuestionIndex].tag);
            var correct_option = JSON.stringify(questions[currentQuestionIndex].correct_option);

            if (question_tag.replace(/[^a-zA-Z0-9]/g, '') == "attentionCheck")
            {
                if(correct_option.replace(/[^a-zA-Z0-9]/g, '') != userRating)
                {
                    document.getElementById("Box1").style.display = 'none';
                    document.getElementById("Box2").style.display = 'none';
                    var endPage = document.getElementById("end-container");
                    endPage.textContent = "ATTENTION CHECK FAILED! \n Thank you for participating in the study. Please click on the submit button to end.";
                    submitButton.style.display = 'block';
                }
            }
            createResponseData(JSON.stringify(questions[currentQuestionIndex].question), JSON.stringify(questions[currentQuestionIndex].option), JSON.stringify(questions[currentQuestionIndex].tag), userRating, allClicks, startTime, endTime, elapsedTime);
            currentQuestionIndex++;
            selectedOption = null; // Reset selected option
            userRating = null; 
            allClicks = [];

            if (currentQuestionIndex < questions.length) 
            {
                displayQuestion();
                startTime = new Date(); // Record start time for the next question
            }
            else
            {
                document.getElementById("Box1").style.display = 'none';
                document.getElementById("Box2").style.display = 'none';
                updateTimer();
            }
        } 
    });
    submitButton.addEventListener("click", function () {
         // create the form element and point it to the correct endpoint
        if (userRating) {
            var endTime = new Date();
            var elapsedTime = endTime - startTime;
        }
            
        console.log("Submit Triggered" + JSON.stringify(allResponses));
        
        const urlParams = new URLSearchParams(window.location.search); 
        const form = document.createElement('form');
        form.action = (new URL('mturk/externalSubmit', urlParams.get('turkSubmitTo'))).href;
        form.method = 'post';
        
        // attach the assignmentId
        const inputAssignmentId = document.createElement('input');
        inputAssignmentId.name = 'assignmentId';
        inputAssignmentId.value = urlParams.get('assignmentId');
        inputAssignmentId.hidden = true;
        form.appendChild(inputAssignmentId);
        
        // attach data I want to send back
        const responseUserData = document.createElement('input');
        responseUserData.name = 'response';
        responseUserData.value = JSON.stringify(allResponses);
        responseUserData.hidden = true;
        form.appendChild(responseUserData);
        
        // attach the form to the HTML document and trigger submission
        document.body.appendChild(form);
        form.submit();
    });

    nextButton.style.display = "block";
    submitButton.style.display = "none";
}
    // Entry point
readCSV("questions-sample.csv", function (data) {
    // Assuming CSV structure: question, option
    for (var i = 0; i < data.length; i++) {
        var questionData = data[i];
        var question = {
            question: questionData[0],
            option: questionData[1],
            tag: questionData[2],
            correct_option: questionData[3],
        };
        questions.push(question);
    }
startTime = new Date();
console.log("Number of questions: " + questions.length);
displayQuestion();
});