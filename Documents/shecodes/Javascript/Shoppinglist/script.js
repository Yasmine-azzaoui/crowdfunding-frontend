let shoppingListItems = ["milk", "eggs", "bread"];
// variable first, then function then lets go!

// // ul from html below
// let listElement = document.getElementById("shopping-list-items");

// for (const shoppingItem of shoppingListItems) {
//     console.log(shoppingItem);
//     // Create list elemt
//     let itemElement = document.createElement("li");

//     // Add the inner text to the list element
//     itemElement.innerText = shoppingItem;
//     // Add list element to the ul

//     listElement.appendChild(itemElement);
// }
//updateItems();

const addItem = () => {
    let item = document.getElementById("new-item-text").value;
    shoppingListItems = [...shoppingListItems, item];
    console.log(shoppingListItems);
    updateItems();
    // not declaring it, just getting it
    // empty string seems to clear stuff 
    //document.getElementById("new-item-text").value = ""

};

const removeList = () => {
    shoppingListItems = []; // clearin the database
    updateItems();

};

const updateItems = () => {
    //First we get the list element
    let listElement = document.getElementById("shopping-list-items");
    // Then we clear it of any existing items
    listElement.innerHTML = "";

    //Then we loop through the shopping list items and add them to the list
    for (const shoppingItem of shoppingListItems) {
        let itemElement = document.createElement("li");
        itemElement.innerText= shoppingItem;
        listElement.appendChild(itemElement);
    }



};