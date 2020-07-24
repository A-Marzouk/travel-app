// make sure to export the function you would like to import

const errorElement = document.getElementById('errorFeedback');
const evaluationElement = document.getElementById('evaluation');
const evaluationElementWrapper = document.getElementById('evaluationWrapper');

function handleFormSubmit(event) {
    errorElement.innerText = '';
    event.preventDefault();

    // take the value entered in the input
    let textInput = document.getElementById('textInput').value;

    // validate the form input | should be valid url.
    if (!validateUrl(textInput)) {
        // update error layout
        errorElement.innerText = 'Not a valid URL.';
        return;
    }

    // send it to the server ( to evaluate through the API )

    Client.postData('/evaluate', {textInput: textInput})
        .then((response) => {
            // update layout with result from server:
            evaluationElement.innerHTML = formatHTML(response.evaluationData);
            evaluationElementWrapper.style.display = 'block';
        });


}

function formatHTML(data){
    let HTML = '' ;

    let text = data.text;
    let results = data.results;

    HTML += `<b>Text: </b> ${text} <br/>`;
    HTML += `<hr/>`;
    HTML += `<b>Results: </b><br/>`;

    // the results are array of objects: [endpoint and result]

    for (let i = 0; i < results.length ; i++){
        HTML += `<b>Endpoint: </b> ${results[i].endpoint} <br/>`;

        // result is an object of key value pairs
        HTML += '<div class="p-2">';
        HTML += `<b>Results: </b><br/>`;
        let resultsObject = results[i].result;
            for(let key in resultsObject){
                if(resultsObject[key].length !== 0){
                    HTML += `<b>${key}: </b> ${resultsObject[key]} <br/>`;
                }
            }
        HTML += '</div>';

    }


    return HTML ;
}

function validateUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}

module.exports = {
    handleFormSubmit
} ;