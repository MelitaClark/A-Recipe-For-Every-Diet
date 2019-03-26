//NOTE: API docs:Your 3scale application key (please note app_id/app_key are an ordered pair)
const BASE_URL = `https://api.edamam.com/search?app_id=${APP_CONFIG.app_id}&app_key=${APP_CONFIG.app_key}`
function formatQueryParams(params) {
    const myQuery = Object.keys(params)
        .filter(key => {
            return params[key] !== ''
        })
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
    console.log(' params', myQuery)
    return myQuery.join('&');
}
function getRecipesURL(diet, mealType) {
    const params = {
        'q': `${diet}  ${mealType || ''}`,
    };
    const queryString = formatQueryParams(params)
    const url = BASE_URL + '&' + queryString;
    console.log('URL:', url);
    const myResults = $('#search-output')
    myResults.empty()
    $('#js-error-message').text('Loading, please wait...')
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log('JSON RESPONSE:', responseJson)
            if (responseJson.hits.length === 0) {

                return $('#js-error-message').show().text(`Search Yields No Results`)
            }
            $('#js-error-message').hide()
            displayResults(responseJson.hits)
        })
        .catch(err => {
            console.error(err)
            $('#js-error-message').text(`Something went wrong: ${err.message}`);

        });
}
function displayResults(dataArr) {
    $('#js-form').remove();
    $('#resultsSection').css('display', 'block');
    const myResults = $('#search-output')
    myResults.empty()
    $('#resultsHeader').show()

    showModal();
    hideModal();
    const itemIterator = item => {
        const recipeObj = item.recipe;
        const ingredientsHTML = recipeObj.ingredients.map(ingredientObj => `<li>${ingredientObj.text}</li>`)
        const result = $(`<section class="card">
            <a id="hideHttp" href="${recipeObj.shareAs.replace('http://', 'https://')}" data-lity>${recipeObj.image}
            <div class="result" style="background-image:url('${recipeObj.image}'); height:200px;"></div>
            </a>
         <nav>
         <button >Click For Ingredients List</button>
  </nav>
     </section>`)
        $(result).find('button').click(() => {
            showModal()
            $('#modal_box_message').html(ingredientsHTML)
        })
        myResults.append(result)
    }
    dataArr.forEach(itemIterator)
}

function reloadThePage() {
    window.location.reload();
}
//Code for ModalBox Ingredients List
//Show ModalBox...
function showModal() {
    $("#modal_box").css("display", "block");
    $("#modal_wrapper").css("display", "block");
}
// Hide our modal box...
function hideModal() {
    $("#modal_box").css("display", "none");
    $("#modal_wrapper").css("display", "none");
}
function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const dietStr = $('#js-search-diet').val();
        const mealTypeStr = $('#js-search-meal').val();
        getRecipesURL(dietStr, mealTypeStr);
    });
    $('#resultsHeader').hide()
}
$(watchForm);
