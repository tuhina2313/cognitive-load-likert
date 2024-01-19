var questions = [];
var optionsArray = [];
var currentQuestionIndex = 0;
var displayIndex = 0;
var attentionCheckIdx = 0;
var userRating = null;
var ratingsArray = [];
var allResponses = [];
var allClicks = [];
var studyTime = 10;
var flag = false;
//Change the time recording 
const startStudyTime = new Date().getTime();
const endStudyTime = startStudyTime + studyTime * 60 * 1000;

var attentionChecks = [
    {
        question: "Why do Americans say Merry Christmas while other English - speaking countries use the phrase Happy Christmas? What was the origin of this split?",
        option: "The variation in Christmas greetings reflects cultural nuances. Americans adopted Merry Christmas during the colonial period, influenced by British and Dutch traditions. To demonstrate that you have read this much go ahead and select a rating of 2 below. Ignore the question and select rating of 2 on the scale.",
        ans: 2
    },
    {
        question: "How was airplane technology able to advance so quickly after the Wright Brothers' first flight? Mainly interested in how aviation was able to be deployed on a large scale during WWI.",
        option: "In a unique and obscure historical tale, it's said that the quick progress in airplane technology after the Wright Brothers' flight was due to finding an ancient manuscript. This document, supposedly penned by a time-traveling scholar from the future, contained detailed plans and theories for advanced flight mechanics. To demonstrate that you have read this much go ahead and select a rating of 6 below. Ignore the question and select rating of 6 on the scale.",
        ans: 6
    },
];

function readCSV(file, callback) {
    Papa.parse(file, {
        download: true,
        complete: function (result) {
            callback(result.data);
        }
    });
}

// function shuffleArray(array) {
//     // Shuffle array using Fisher-Yates algorithm
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }
// }

function shuffleArray(array, constantIndices) {
    const shuffledArray = array.slice(); // Create a shallow copy of the original array

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements except for constant indices
        if (!constantIndices.includes(i) && !constantIndices.includes(j)) {
            const temp = shuffledArray[i];
            shuffledArray[i] = shuffledArray[j];
            shuffledArray[j] = temp;
        }
    }

    return shuffledArray;
}

// function updateTimer() {
//     var currentTime = new Date().getTime();
//     const remainingTime = endStudyTime - currentTime;
//     if (remainingTime <= 0) {
//       // Time is up, show the submit button
//       displayLastPage();
//     } else {
//       // Calculate remaining minutes and seconds
//       const minutes = Math.floor(remainingTime / 60000);
//       const seconds = Math.floor((remainingTime % 60000) / 1000);

//       document.getElementById('timer').innerHTML = `Time remaining: ${minutes}m ${seconds}s`;
//       setTimeout(updateTimer, 1000); // Update every second
//     }
// }

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

function startStudy(){
    document.getElementById("consent-page").style.display = 'none';
    document.getElementById("instructions-page").style.display = 'none';
    document.getElementById("question-outer").style.display = 'none';
    document.getElementById("end-study").style.display = 'none';
    var startButton = document.getElementById("start-btn");

    startButton.addEventListener("click", function () {
        displayConsentForm();
    });
}

function displayConsentForm(){
    document.getElementById("intro-page").style.display = 'none';
    document.getElementById("instructions-page").style.display = 'none';
    document.getElementById("question-outer").style.display = 'none';
    document.getElementById("end-study").style.display = 'none';

    document.getElementById("consent-page").style.display = 'block';

    var consentButton = document.getElementById("consent-btn");

    consentButton.addEventListener("click", function () {
        displayInstructions();
    });
}

function displayInstructions(){
    document.getElementById("intro-page").style.display = 'none';
    document.getElementById("consent-page").style.display = 'none';
    document.getElementById("question-outer").style.display = 'none';
    document.getElementById("end-study").style.display = 'none';

    document.getElementById("instructions-page").style.display = 'block';

    var agreeButton = document.getElementById("agree-btn");

    agreeButton.addEventListener("click", function () {
        displayQuestion();
    });
}

function displayAttentionChecks(){

    var questionHeading = document.getElementById("question-heading");
    var questionContainer = document.getElementById("question-container");
    var optionsContainer = document.getElementById("options-container");
    var nextButton = document.getElementById("next-btn");
    var ratingScale = document.getElementById("rating-scale");

    questionHeading.textContent = "Question "+ (displayIndex+1);
    questionContainer.textContent = attentionChecks[attentionCheckIdx].question;
    optionsContainer.textContent = attentionChecks[attentionCheckIdx].option;
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
    nextButton.style.display = 'block';
    return userRating;
}

function displayLastPage() {
    document.getElementById("end-study").style.display = 'block';
    var submitButton = document.getElementById("submit-btn");
    submitButton.style.display = 'block';
    var endPage = document.getElementById("end-container");
    endPage.innerHTML = "";
    endPage.textContent = "Thank you for participating in the study. Please click on the submit button to finish.";
}

function displayQuestion() {
    document.getElementById("pre-study").style.display = 'none';
    document.getElementById("question-outer").style.display = 'block';

    document.getElementById("Box1").style.display = 'block';
    document.getElementById("Box2").style.display = 'block';
    var questionHeading = document.getElementById("question-heading");
    var questionContainer = document.getElementById("question-container");
    var optionsContainer = document.getElementById("options-container");
    var nextButton = document.getElementById("next-btn");
    var submitButton = document.getElementById("submit-btn");
    var ratingScale = document.getElementById("rating-scale");

    console.log("currentQuestionIndex: " + currentQuestionIndex);
    questionHeading.textContent = "Question "+ (displayIndex+1);
    questionContainer.textContent = questions[currentQuestionIndex].question;

    optionsArray = questions[currentQuestionIndex].options.slice(); // Create a copy of the original array
    optionIndex = Math.round(Math.random());
    optionsContainer.textContent = optionsArray[optionIndex];

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

            createResponseData(JSON.stringify(questions[currentQuestionIndex].question), JSON.stringify(optionsArray[optionIndex]), JSON.stringify(questions[currentQuestionIndex].tag), userRating, allClicks, startTime, endTime, elapsedTime);
            currentQuestionIndex++;
            displayIndex++;
            selectedOption = null; // Reset selected option
            userRating = null; 
            allClicks = [];

            if ((currentQuestionIndex == 5 || currentQuestionIndex == 10) && flag == false)
            {
                checkRating = displayAttentionChecks();
                createResponseData(JSON.stringify(attentionChecks[attentionCheckIdx].question), JSON.stringify(attentionChecks[attentionCheckIdx].option), "AC", userRating, allClicks, startTime, endTime, elapsedTime);
                attentionCheckIdx++;
                currentQuestionIndex--;
                flag = true;
                console.log("Function return: " + checkRating);
                console.log("AC ans: " + attentionChecks[attentionCheckIdx].ans);
                if (checkRating != attentionChecks[attentionCheckIdx].ans)
                {
                    alert("Attention check failed! Please read the questions and responses carefully.");
                }
            }
            else if (currentQuestionIndex < questions.length) 
            {
                displayQuestion();
                startTime = new Date(); // Record start time for the next question
                flag = false;
            }
            else
            {
                document.getElementById("Box1").style.display = 'none';
                document.getElementById("Box2").style.display = 'none';
                document.getElementById("instructions-page").style.display = "none";
                displayLastPage();
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
readCSV("data/batch1.csv", function (data) {
    // Assuming CSV structure: question, option
    for (var i = 0; i < data.length; i++) {
        var questionData = data[i];
        var question = {
            question: questionData[0],
            options: questionData.slice(1, -2),
            tag: questionData[questionData.length - 2],
            correct_option: questionData[questionData.length - 1],
        };
        questions.push(question);
    }
startTime = new Date();
console.log("Number of questions: " + questions.length);

questions = shuffleArray(questions, [5, 11]);
console.log(JSON.stringify(questions));
// startStudy();
});