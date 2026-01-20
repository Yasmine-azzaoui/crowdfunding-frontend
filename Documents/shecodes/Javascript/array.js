/*
Arrays
let names = ["charlie", "alfie", "rachel"];
let age = [30,6,33]
let random = ["Charlie", 30, true]

names[0] = "jordan"
console.log(names.slice(0))*/

//FUNCTIONS
function sayHello() {
console.log("hello world")
};
sayHello();

function doILikeCoding(answer) {
if (answer ==true){
    console.log("Charlie likes coding");
} else if (answer == false) {
    console.log("Charlie hates coding");
}
    else {
        console.log("Charlie has an unknown opinion")
    }
}
doILikeCoding(true)

function tallEnoughToRide(height) {
    if(height >= 180) {
    console.log("You are tall enough")
}
}
tallEnoughToRide(179);

const heights = [180, 181, 182, 183];

for (let index=0; index<heights.length; index ++){
    tallEnoughToRide(heigths[index]);}

    function printNumbers(number){
        let answer = 0;
    for(let number = 0; number < limit; number++){
        if (number % 3 ==0){
        console.log(number);
    }
}
console.log(answer)

    }
printNumbers(50)

//of same as = 
const countries = ["Australia", "New Zealand", "Japan", "Indonesia"]
    for (const country in countries) {
        console.log(country);
    }