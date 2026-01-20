//This is a comment:

/*
This also works for more than one liners
*/
/* DON'T DO THIS
var our_variable = "a string"
*/
let myName = "Yasmine"
// const instead of let fixes the name as Yasmine, no overwriting
console.log(myName)

//Reassign the name
myname = "Jordan"
// semi-colon means end of a line  ;

console.log(myName)
//SUMMARY 
// LET AND CONST
// camelCaseNaming
//;;;;;;;;;;
// "String"
// true Bolean 
// 6 INTEGER


//CHAPTER 2

// THIS IS AN OBJECT SAME AS DICTIONARY IN PYTHON
// const person ={
//     name: "Charlie",
//     age: 30, 
//     likesCoding: true
// }
// console.log(person)
// console.log(person.age)

// NEST OBJECT WITHIN OBJECT
let person ={
    name: "Charlie",
    age: 30, 
    preferences: {
        likesCoding:true,
        likesCooking:true,
    },
};

let person2 ={
    name: "Alfie",
    age: 6, 
    preferences: {
    likesCoding:true,
    likesCooking:true,
    },
};


console.log(person.age);
console.log(person2.age);
console.log(person2.preferences.likesCoding);

const person3 = {
name: "Rachel",
age: 33,
City: "Brisbane"
}

// const {name, age, city} = person3;
// three dots says everything else
const {name, ... other} = person3;

console.log(person3.name)
console.log(name)
