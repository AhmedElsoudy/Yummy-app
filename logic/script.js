/// <reference types="../@types/jquery" />


//   Side Navbar
function openNav() {
    $(".side-navbar").animate({
        left: 0
    }, 1000)

    $("#openside").removeClass("d-block")
    $("#openside").addClass("d-none")
    $("#closeside").removeClass("d-none")
    $("#closeside").addClass("d-block")

    for (let i = 0; i < 5; i++) {
        $(".list-nav li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}

function closeNav() {
    let boxWidth = $(".side-navbar .nav-left-side").outerWidth()
    $(".side-navbar").animate({
        left: -boxWidth
    }, 500)

    $("#openside").removeClass("d-none")
    $("#openside").addClass("d-block")
    $("#closeside").removeClass("d-block")
    $("#closeside").addClass("d-none")

    $(".list-nav li").animate({
        top: 300
    }, 500)

}


$(".side-navbar .close-open-icon").on('click',function(){
    if ($(".side-navbar").css("left") == "0px") {
        closeNav()
    } else {
        openNav()
    }
})
closeNav()


// ----------------------- Search  -------------------------

async function searchByName(term) {

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    response = await response.json()

    response.meals ? displaySearchMeals(response.meals) : displaySearchMeals([])

}

async function searchByFLetter(term) {

    term == "" ? term = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
    response = await response.json()

    response.meals ? displaySearchMeals(response.meals) : displaySearchMeals([])

}
$("#searchbtn").on("click", function(){

    $("#search").removeClass("d-none")
    $("#categorysection").addClass("d-none")
    $("#areasection").addClass("d-none")
    $("#ingredientssection").addClass("d-none")
    $("#contactsection").addClass("d-none")


    closeNav()
})
$("#searchName").on("input", function(){
    searchByName($("#searchName").val())
    closeNav()
})
$("#searchLetter").on("input", function(){
    searchByName($("#searchLetter").val())
    closeNav()
})

function displaySearchMeals(arr) {
    let carton =``;

    for (let i = 0; i < arr.length; i++) {
        carton += `
        <div class="col-md-3">
                <div onclick="getSearchMealDetails('${arr[i].idMeal}')" class="inner rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="caption position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    $("#rowSearch").html(carton)
}
async function getSearchMealDetails(mealID) {


    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    response = await response.json();
    displaySearchMealDetails(response.meals[0])

}

function displaySearchMealDetails(meal) {
    $("#search").html("")

    let ingredients = ``
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    let tags = meal.strTags?.split(",")
    // let tags = meal.strTags.split(",")
    if (!tags) tags = []
    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }
    let carton = `
    <div class= "container">
    <div class = "row" >
    <div class="col-md-4 text-white">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8  text-white">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>
            </div>
            </div>`

            $("#search").html(carton)
    
}



// ----------------------- CATEGORY -------------------------

async function getCategories() {
    
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    response = await response.json()
    // console.log(response.categories)
    displayCategories(response.categories)

}

$("#categorybtn").on("click", function(){
    $("#search").addClass("d-none")
    $("#categorysection").removeClassClass("d-none")
    $("#areasection").addClass("d-none")
    $("#ingredientssection").addClass("d-none")
    $("#contactsection").addClass("d-none")
    getCategories();
    closeNav()
})
function displayCategories(arr) {

    let carton = ``
    for (let i = 0; i < arr.length; i++) {
        carton += `
        <div class="col-md-3">
        <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="inner rounded-2 cursor-pointer" id="meal">
            <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
            <div class="caption  text-center text-black p-2">
                <h3>${arr[i].strCategory}</h3>
                <p>${arr[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
            </div>
        </div>
        </div>
        `
    }
    $("#category").html(carton)
}

async function getCategoryMeals(category) {

    $("#category").html("")
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    response = await response.json()
    displayCategoryMeals(response.meals.slice(0, 20))

}
function displayCategoryMeals(arr) {
    let carton =``;

    for (let i = 0; i < arr.length; i++) {
        carton += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="inner rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="caption position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    $("#category").html(carton)
}

async function getMealDetails(mealID) {


    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    response = await response.json();
    displayMealDetails(response.meals[0])

}

function displayMealDetails(meal) {
    $("#category").html("")

    let ingredients = ``
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    let tags = meal.strTags?.split(",")
    // let tags = meal.strTags.split(",")
    if (!tags) tags = []
    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }
    let carton = `
            <div class="col-md-4 text-white">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                alt="">
                <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-md-8  text-white">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
            <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${ingredients}
            </ul>

            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${tagsStr}
            </ul>

            <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>`


            $("#category").html(carton)
    
}


// ----------------------- AREA -------------------------

async function getArea() {

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    response = await response.json()
    // console.log(response.meals);

    displayArea(response.meals)

}

$("#areabtn").on("click", function(){
    $("#search").addClass("d-none")
    $("#categorysection").addClass("d-none")
    $("#areasection").removeClass("d-none")
    $("#ingredientssection").addClass("d-none")
    $("#contactsection").addClass("d-none")
    getArea();
    closeNav()
})

function displayArea(arr) {
    let carton = ``;

    for (let i = 0; i < arr.length; i++) {
        carton += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer text-white">
                        <i class="fa-solid fa-location-dot fa-4x "></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
        `
    }

    $("#area").html(carton)
}

async function getAreaMeals(area) {
    $("#area").html("")

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()


    displayAreaMeals(response.meals.slice(0, 20))

}

function displayAreaMeals(arr) {
    let carton =``;

    for (let i = 0; i < arr.length; i++) {
        carton += `
        <div class="col-md-3">
                <div onclick="getAreaMealDetails('${arr[i].idMeal}')" class="inner rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="caption position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    $("#area").html(carton)
}

async function getAreaMealDetails(mealID) {


    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    response = await response.json();
    displayAreaMealDetails(response.meals[0])

}

function displayAreaMealDetails(meal) {
    $("#area").html("")

    let ingredients = ``
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    let tags = meal.strTags?.split(",")
    // let tags = meal.strTags.split(",")
    if (!tags) tags = []
    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }
    let carton = `
    <div class="col-md-4 text-white">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8  text-white">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

            $("#area").html(carton)
    
}


// ----------------------- INGREDIENTS -------------------------

async function getIngredients() {

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    response = await response.json()
    console.log(response.meals);

    displayIngredients(response.meals.slice(0, 20))

}

$("#ingredientsbtn").on("click", function(){
    $("#search").addClass("d-none")
    $("#categorysection").addClass("d-none")
    $("#areasection").addClass("d-none")
    $("#ingredientssection").removeClass("d-none")
    $("#contactsection").addClass("d-none")
    getIngredients()
    closeNav()
})


function displayIngredients(arr) {
    let carton = ``;

    for (let i = 0; i < arr.length; i++) {
        carton += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer text-white">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
    }
    $("#ingredients").html(carton)
}

async function getIngredientsMeals(ingredients) {
    
    $("#ingredients").html("")

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    response = await response.json()
    displayIngredientsMeals(response.meals.slice(0, 20))

}

function displayIngredientsMeals(arr) {
    let carton =``;

    for (let i = 0; i < arr.length; i++) {
        carton += `
        <div class="col-md-3">
                <div onclick="getIngredientsMealDetails('${arr[i].idMeal}')" class="inner rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="caption position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }
    $("#ingredients").html(carton)
}

async function getIngredientsMealDetails(mealID) {


    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    response = await response.json();
    displayIngredientsMealsDetails(response.meals[0])

}


function  displayIngredientsMealsDetails(meal) {
    $("#ingredients").html("")

    let ingredients = ``
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    let tags = meal.strTags?.split(",")
    // let tags = meal.strTags.split(",")
    if (!tags) tags = []
    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }
    let carton = `
    <div class="col-md-4 text-white">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8  text-white">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

            $("#ingredients").html(carton)
    
}







// ----------------------- CONTACT US -------------------------

$("#contactbtn").on("click", function(){
    $("#search").addClass("d-none")
    $("#categorysection").addClass("d-none")
    $("#areasection").addClass("d-none")
    $("#ingredientssection").addClass("d-none")
    $("#contactsection").removeClass("d-none")
    closeNav()
})

// -- NAME
function userNameValidation(){
    let regName = /^[a-zA-Z0-9_-]{3,20}$/;
    if(regName.test($("#nameInput").val()) == true){
        $("#nameInput").removeClass("is-invalid")
        $("#nameInput").addClass("is-valid")
        $("#nameAlert").removeClass("d-block")
        $("#nameAlert").addClass("d-none")
    }else{
        $("#nameInput").removeClass("is-valid")
        $("#nameInput").addClass("is-invalid")
        $("#nameAlert").removeClass("d-none")
        $("#nameAlert").addClass("d-block")
    }
}
$("#nameInput").on("keyup", function(){
    userNameValidation()
})

// --EMAIL
function userEmailValidation(){
    let regEmail = /^^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(regEmail.test($("#emailInput").val()) == true){
        $("#emailInput").removeClass("is-invalid")
        $("#emailInput").addClass("is-valid")
        $("#emailAlert").removeClass("d-block")
        $("#emailAlert").addClass("d-none")
    }else{
        $("#emailInput").removeClass("is-valid")
        $("#emailInput").addClass("is-invalid")
        $("#emailAlert").removeClass("d-none")
        $("#emailAlert").addClass("d-block")
    }
}
$("#emailInput").on("keyup", function(){
    userEmailValidation()
})

// --PHONE
function userPhoneValidation(){
    let regPhone = /^\+(?:[0-9] ?){6,14}[0-9]$/;

    if(regPhone.test($("#phoneInput").val()) == true){
        $("#phoneInput").removeClass("is-invalid")
        $("#phoneInput").addClass("is-valid")
        $("#phoneAlert").removeClass("d-block")
        $("#phoneAlert").addClass("d-none")
    }else{
        $("#phoneInput").removeClass("is-valid")
        $("#phoneInput").addClass("is-invalid")
        $("#phoneAlert").removeClass("d-none")
        $("#phoneAlert").addClass("d-block")
    }
}
$("#phoneInput").on("keyup", function(){
    userPhoneValidation()
})

// --AGE
function userAgeValidation(){
    let regAge = /^\S[0-9]{0,3}$/;

    if(regAge.test($("#ageInput").val()) == true){
        $("#ageInput").removeClass("is-invalid")
        $("#ageInput").addClass("is-valid")
        $("#ageAlert").removeClass("d-block")
        $("#ageAlert").addClass("d-none")
    }else{
        $("#ageInput").removeClass("is-valid")
        $("#ageInput").addClass("is-invalid")
        $("#ageAlert").removeClass("d-none")
        $("#ageAlert").addClass("d-block")
    }
}
$("#ageInput").on("keyup", function(){
    userAgeValidation()
})

// --PASSWORD
function userPassValidation(){
    let regPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if(regPass.test($("#passwordInput").val()) == true){
        $("#passwordInput").removeClass("is-invalid")
        $("#passwordInput").addClass("is-valid")
        $("#passwordAlert").removeClass("d-block")
        $("#passwordAlert").addClass("d-none")
    }else{
        $("#passwordInput").removeClass("is-valid")
        $("#passwordInput").addClass("is-invalid")
        $("#passwordAlert").removeClass("d-none")
        $("#passwordAlert").addClass("d-block")
    }
}
$("#passwordInput").on("keyup", function(){
    userPassValidation()
})

// --REPASSWORD
function userRePassValidation(){
    let regPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if(regPass.test($("#repasswordInput").val()) == true){
        $("#repasswordInput").removeClass("is-invalid")
        $("#repasswordInput").addClass("is-valid")
        $("#repasswordAlert").removeClass("d-block")
        $("#repasswordAlert").addClass("d-none")
    }else{
        $("#repasswordInput").removeClass("is-valid")
        $("#repasswordInput").addClass("is-invalid")
        $("#repasswordAlert").removeClass("d-none")
        $("#repasswordAlert").addClass("d-block")
    }
}
$("#repasswordInput").on("keyup", function(){
    userRePassValidation()
})




// <div class="col-md-3 rounded-4" >
// <div class="inner ">
//     <div class="picture">
//         <img src="${arr[i].strCategoryThumb}" class="w-100 rounded-3" alt="">
//     </div>
//     <div class="caption  d-flex justify-content-center align-items-end rounded-3">
//         <p class="fs-3">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
//     </div>
// </div>
// </div>