// function add() {
//     console.log("add this");
// }

// SAME AS ABOVE, JUST NEVER
const add = (step) => {
    // console.log("add function") -- just if i want to see this displayed in the console log
    // console.log('this is going to add 10')
    let numberElement = document.getElementById("number")
    let number = numberElement.innerText;
    // differen from inner HTML as it only gives you the Text, rathern than everything in the html, better for secuirty 
    console.log(number);
    number = parseInt(number)
    //making it a number, just for calc to avoid line 17 error, now it's a number that will be calculated and changed back to a string later.
    number = number + step;
    numberElement.innerText = number;
    //document.getElement blala , but not necessary as we defined it in the variable.
    //this logic returns it as a string, so it just adds number one so it goes 0 then 01 then 011 etc.
    
};

