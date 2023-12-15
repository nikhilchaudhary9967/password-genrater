const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[ data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".genrateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");


let password = "";
let passwordLength = 10;
let checkCount = 0;
const symbols = '~`!@#$%^&*()_+=-{}[]\|;:"<,>,?/';
setIndicator("#ccc");

// funstion starts 

// set password length 
handleSlider();
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"%  100%";
    //                              <----------width----------------------><height>
}


// set indicator 
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = '0px 0px 12px 1px ${color}';
}

// random integer 
function getRndomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// genrate random number case
function generateRandomNumber() {
    return getRndomInteger(0, 9);
}
// genrate random lower case
function generateLowercase() {
    return String.fromCharCode(getRndomInteger(97, 123));
}
// genrate random upper case
function generateUppercase() {
    return String.fromCharCode(getRndomInteger(65, 91));
}
// genrate random symbol case
function generateSymbol() {
    const randNum = getRndomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// calulate strength 
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (upperCaseCheck.checked) hasUpper = true;
    if (lowerCaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }

}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "failed";

    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    //special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}


//---------------------------------------------------------------
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})


generateBtn.addEventListener('click', () => {
    //none of the checkbox selected
    if (checkCount <= 0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //let start the journry to find new password

    //remove old password
    password = "";

    //let'sput the stuff mentioned by checkboxes
    //  if(upperCaseCheck.checked){
    //     password+=generateUppercase();
    //  }
    //  if(lowerCaseCheck.checked){
    //     password+=generateLowercase();
    //  }
    //  if(symbolsCheck.checked){
    //     password+=generateSymbol();
    //  }
    //  if( numbersCheck.checked){
    //     password+=generateRandomNumber();
    //  }

    let funcArr = [];

    if (upperCaseCheck.checked)
        funcArr.push(generateUppercase);

    if (lowerCaseCheck.checked)
        funcArr.push(generateLowercase);

    if (numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulser addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    //remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndomInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;
    //calculATE STRENGTH
    calcStrength()


});