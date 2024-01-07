var questions = [];
var currentQuestionIndex = 0;
var userRating = null;
var ratingsArray = [];
var answersArray = [];
var responseTimeData = [];
var allResponses = [];
var allClicks = [];


function readCSV(file, callback) {
    Papa.parse(file, {
        download: true,
        complete: function (result) {
            callback(result.data);
        }
    });
}

function createResponseData(ques, res, question_tag, ratingVal, allClicks, startT, endT, elaspsedT){
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
    var endPage = document.getElementById("end-container");
    endPage.innerHTML = "";
    endPage.textContent = "Thank you for participating in the study. Please click on the submit button to finish."
}

function displayQuestion() {
    var questionContainer = document.getElementById("question-container");
    var optionsContainer = document.getElementById("options-container");
    var nextButton = document.getElementById("next-btn");
    var submitButton = document.getElementById("submit-btn");
    var ratingScale = document.getElementById("rating-scale");

    var question_text = JSON.stringify(questions[currentQuestionIndex].question);
    var option_text = JSON.stringify(questions[currentQuestionIndex].option);
    question_tag = JSON.stringify(questions[currentQuestionIndex].tag);
    correct_option = JSON.stringify(questions[currentQuestionIndex].correct_option);

    questionContainer.textContent = questions[currentQuestionIndex].question;
    optionsContainer.textContent = questions[currentQuestionIndex].option;
    answersArray.push(option_text);

    // questions[currentQuestionIndex].options.forEach(function (option, index) {
    //     var optionDiv = document.createElement("div");
    //     optionDiv.className = "option";
    //     optionDiv.textContent = option;
    //     answersArray.push(JSON.stringify(option));

    //     optionsContainer.appendChild(optionDiv);
    // });

    ratingScale.innerHTML = "";
    for (let i = 1; i <= 7; i++) {
        var ratingOption = document.createElement("div");
        ratingOption.className = "rating-option";
        ratingOption.textContent = i;

        ratingOption.addEventListener("click", function () {
            userRating = i;
            console.log("User Rating: " + userRating);
            allClicks.push(userRating);
            console.log("All clicks: " + allClicks);

            // Remove previous selection styling
            document.querySelectorAll('.rating-option').forEach(function (el) {
                el.style.backgroundColor = "";
            });

            // Add new selection styling
            ratingOption.style.backgroundColor = "#e0e0e0";
        });

        ratingScale.appendChild(ratingOption);
    }

    nextButton.addEventListener("click", function () {
        if (userRating) {
            var endTime = new Date();
            var elapsedTime = endTime - startTime;
            console.log("Elapsed time: " + elapsedTime + " milliseconds");
            ratingsArray.push(JSON.stringify(userRating));
            responseTimeData.push(JSON.stringify(elapsedTime));
            console.log("Array: " + allClicks);

            if (question_tag == "attentionCheck")
            {
                if(correct_option != JSON.stringify(userRating))
                {
                    displayLastPage();
                }
            }

            createResponseData(question_text, option_text, question_tag, userRating, allClicks, startTime, endTime, elapsedTime);
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
                questionContainer.style.display = 'none';
                optionsContainer.style.display = 'none';
                nextButton.style.display = 'none';
                ratingScale.style.display = 'none';
                document.getElementById("rating-text").style.display = 'none';
                displayLastPage();
                submitButton.style.display = "block";
            }
        } 
    });
    submitButton.addEventListener("click", function () {
         // create the form element and point it to the correct endpoint
        if (userRating) {
            var endTime = new Date();
            var elapsedTime = endTime - startTime;
            
            answersArray.push(JSON.stringify(questions[currentQuestionIndex].option));
            responseTimeData.push(JSON.stringify(elapsedTime));
            }
        console.log("Submit Triggered" + allResponses);
        
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