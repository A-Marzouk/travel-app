const errorElement = document.getElementById('errorFeedback');

const postData = async (url = '', data = {}) => {
    // use Fetch API to Post data: // use try here for internet failing error.
    try{
        const request = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        // read the response of this request:
        try {
            return await request.json();
        } catch (e) {
            errorElement.innerHTML = 'Error: ' + e.message;
        }
    }catch (e) {
        errorElement.innerHTML = 'Error: ' + e.message + ' | Please check your internet connection.';
    }

};

module.exports = {
    postData
} ;