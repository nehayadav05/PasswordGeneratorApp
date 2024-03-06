const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()-_+={[}]|;:"<,>./?' //we have store all the symbols in a string

//Default
let password="";//password is empty at default
let passwordLength=10;//password length is 10 at default
let checkCount=0;//one checkbox is checked at default
handleSlider();
//set strength circle color to grey at default
setIndicator("#ccc");


//set passwordLength
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min)) + "% 100%";
}


function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    
}

function generateRndInteger(min,max){
     return Math.floor(Math.random()*(max-min))+min;//see diary
}

function generateRandomNumber(){
    return generateRndInteger(0,9);
}
function generateLowercase(){
    return String.fromCharCode(generateRndInteger(97,123));
}
function generateUppercase(){
    return String.fromCharCode(generateRndInteger(65,90));
}
function generateSymbols(){
    const random=generateRndInteger(0,symbols.length);
    return symbols.charAt(random);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNums=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNums=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNums || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }else if((hasUpper || hasLower) && (hasNums || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }

}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";

    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    //To make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array){
    //Fisher Yates Method
    for(let i=array.length-1;i>0;i--){
        //random j, find out using random function
        const j=Math.floor(Math.random()*(i+1));
        //swap
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el) => (str += el));
    return str;
}

function hanndleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
         checkCount++;
    });

    //special condition
    if(passwordLength<checkCount){
       passwordLength=checkCount;
      handleSlider();
    }
   
}


allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',hanndleCheckBoxChange);//change is bot ticked and unticked
});

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;//e.target.value gives the slider value
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
    //input Jaha password show hoga agr non-empty h then copy 
    if(passwordDisplay.value) //or if(passwordLength>0)
    copyContent();
});

generateBtn.addEventListener('click',()=>{
    //none of the checkbox are selected
    if(checkCount==0) 
     return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //let's start the journey to find a new password

    //remove old password
    password="";

    //let's put the stuff mentioned by the checkBoxes

    // if(uppercaseCheck.checked){
    //     password+=generateUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowercase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbols();
    // }

    let funcArr=[];
    
    if(uppercaseCheck.checked)
      funcArr.push(generateUppercase);

    if(lowercaseCheck.checked)
      funcArr.push(generateLowercase);
    
    if(numbersCheck.checked)
      funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
     funcArr.push(generateSymbols);

    //compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i](); //() means function call
    }

    //random addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=generateRndInteger(0,funcArr.length);
        console.log("randIndex" + randIndex);
        password+=funcArr[randIndex]();
    }

    //shuffle the password
    password=shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value=password;

    //calculate strength
    calcStrength();
});
