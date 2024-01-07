var questions = [];
var currentQuestionIndex = 0;
var currentCheckIndex = 0;
var userRating = null;
var ratingsArray = [];
var answersArray = [];
var responseTimeData = [];
var allResponses = [];
var allClicks = [];
var allChecks = [];
var checkIndex = [1];

var checks = [
    {
        prompt: "The intriguing multiverse thoery posits that our universe is just one among many, offering a mind-bending perspective on the nature of reality and the possibilities beyond our observable cosmos. To demonstrate that you've read this much, just go ahead and select the second option below, no matter what the correct answer is. Yes, ignore the question below and select the above-mentioned option.",
        question: ["Rate the prompt on the scale given"]
    },
    {
        prompt: "The brain is an astonishingly complex organ. Its abilities to process information, adapt to new experiences, and generate consciousness remain the subject of ongoing scientific exploration. To demonstrate that you've read this much, just go ahead and select the last option below, no matter what the correct answer is. Yes, ignore the question below and select the above-mentioned option.",
        question: ["Rate the prompt on the scale given"]
    },
    // Add more questions as needed
];

function readCSV(file, callback) {
    Papa.parse(file, {
        download: true,
        complete: function (result) {
            callback(result.data);
        }
    });
}

function displayAttentionCheck()
{
    var check_prompt = document.getElementById("attention-prompt");
    var check_ques = document.getElementById("attention-question");

    questionContainer.style.display = 'none';
    optionsContainer.style.display = 'none';

    check_prompt.textContent = checks[currentCheckIndex].prompt;
    check_ques.textContent = checks[currentCheckIndex].question;
}

function createCheckData(prompt, question, ratingVal, allClicks, startT, endT, elaspsedT){
    var checkData = {
        prompt: prompt,
        question: question,
        rating: JSON.stringify(ratingVal),
        clicks: allClicks,
        startT: JSON.stringify(startT),
        endT: JSON.stringify(endT),
        responseT: JSON.stringify(elaspsedT),
    };
    allChecks.push(responseData);
}

function createResponseData(ques, res, ratingVal, allClicks, startT, endT, elaspsedT){
    var responseData = {
        question: ques,
        response: res,
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
    var attentionContainer = document.getElementById("attention-container");

    attentionContainer.style.display = 'none';

    question_text = JSON.stringify(questions[currentQuestionIndex].question);
    option_text = JSON.stringify(questions[currentQuestionIndex].option);

    questionContainer.textContent = questions[currentQuestionIndex].question;
    optionsContainer.textContent = questions[currentQuestionIndex].option;
    answersArray.push(JSON.stringify(questions[currentQuestionIndex].option));

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

            if (currentQuestionIndex < questions.length) {
                console.log("Inside R loop: Qind " + currentQuestionIndex);
                createResponseData(question_text, option_text, userRating, allClicks, startTime, endTime, elapsedTime);
                // Move to the next question
                currentQuestionIndex++;
                selectedOption = null; // Reset selected option
                userRating = null; 
                allClicks = [];

                displayQuestion();
                startTime = new Date(); // Record start time for the next question
            }
            else{
                questionContainer.style.display = 'none';
                optionsContainer.style.display = 'none';
                nextButton.style.display = 'none';
                ratingScale.style.display = 'none';
                document.getElementById("rating-text").style.display = 'none';
                displayLastPage();
                submitButton.style.display = "block";
            }
            // if (checkIndex.includes(currentQuestionIndex))
            if (currentQuestionIndex == 1)
            {
                console.log("Inside check loop: Qind " + currentQuestionIndex);
                console.log("Inside check loop: Cind " + currentCheckIndex);
                displayAttentionCheck();
                createCheckData(checks[currentCheckIndex].prompt, checks[currentCheckIndex].question, userRating, allClicks, startTime, endTime, elapsedTime);
                currentCheckIndex++;
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

        const checkUserData = document.createElement('input');
        checkUserData.name = 'attentionChecks';
        checkUserData.value = JSON.stringify(allChecks);
        checkUserData.hidden = true;
        form.appendChild(checkUserData);
        
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
        };
        questions.push(question);
    }
// readCSV("attention_checks.csv", function (check_data) {
//         // Assuming CSV structure: prompt, action
//         for (var i = 0; i < check_data.length; i++) {
//             var aData = check_data[i];
//             var check = {
//                 prompt: aData[0],
//                 question: aData[1],
//             };
//             checks.push(check);
//         }
// });
startTime = new Date();
console.log("Number of questions: " + questions.length);
displayQuestion();
});