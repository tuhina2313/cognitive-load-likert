var questions = [];
var currentQuestionIndex = 0;
var userRating = null;
var ratingsArray = [];
var answersArray = [];
var responseTimeData = [];

function readCSV(file, callback) {
    Papa.parse(file, {
        download: true,
        complete: function (result) {
            callback(result.data);
        }
    });
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

    questionContainer.textContent = questions[currentQuestionIndex].question;

    // Display the options
    optionsContainer.innerHTML = "";
    questions[currentQuestionIndex].options.forEach(function (option, index) {
        var optionDiv = document.createElement("div");
        optionDiv.className = "option";
        optionDiv.textContent = option;
        answersArray.push(JSON.stringify(option));

        optionsContainer.appendChild(optionDiv);
    });

    ratingScale.innerHTML = "";
    for (let i = 1; i <= 7; i++) {
        var ratingOption = document.createElement("div");
        ratingOption.className = "rating-option";
        ratingOption.textContent = i;

        ratingOption.addEventListener("click", function () {
            userRating = i;
            console.log("User Rating: " + userRating);

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
            //responseData[questions[currentQuestionIndex]] = selectedOption;
            //responseTimeData[questions[currentQuestionIndex]] = elapsedTime;
            ratingsArray.push(JSON.stringify(userRating));
            responseTimeData.push(JSON.stringify(elapsedTime));
            console.log("Array: " + ratingsArray);

            // Move to the next question
            currentQuestionIndex++;
            console.log("Question Index: " + currentQuestionIndex);
            selectedOption = null; // Reset selected option
            userRating = null; 
            if (currentQuestionIndex < questions.length) {
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
        } 
    });
    submitButton.addEventListener("click", function () {
         // create the form element and point it to the correct endpoint
        if (userRating) {
            var endTime = new Date();
            var elapsedTime = endTime - startTime;
            
            responseData.push(JSON.stringify(selectedOption));
            responseTimeData.push(JSON.stringify(elapsedTime));
            }
        console.log("Submit Triggered");
        
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
        responseUserData.value = JSON.stringify(responseData);
        responseUserData.hidden = true;
        form.appendChild(responseUserData);

        const timeUserData = document.createElement('input');
        timeUserData.name = 'responseTime';
        timeUserData.value = JSON.stringify(responseTimeData);
        timeUserData.hidden = true;
        form.appendChild(timeUserData);
        
        // attach the form to the HTML document and trigger submission
        document.body.appendChild(form);
        form.submit();
    });

    nextButton.style.display = "block";
    submitButton.style.display = "none";
    if (currentQuestionIndex === questions.length-2){
            displayLastPage();
            submitButton.style.display = "block";
        }
}
    // Entry point
readCSV("questions-sample.csv", function (data) {
    // Assuming CSV structure: question, option1, option2, ..., correctAnswer
    for (var i = 0; i < data.length; i++) {
        var questionData = data[i];
        var question = {
            question: questionData[0],
            options: questionData.slice(1, -1),
            correctAnswer: questionData[questionData.length - 1]
        };
        questions.push(question);
    }

    startTime = new Date();
    console.log("Number of questions: " + questions.length);
    displayQuestion();
});
    // Start the survey
startTime = new Date();
displayQuestion();
console.log("Number of questions: " + questions.length);