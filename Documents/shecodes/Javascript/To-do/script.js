const addTask = () => {
    const newTask = document.getElementById("new-task-text")
    if (newTask.value) {
        todoTasks.push(newTask.value);
        todoTasksStatus.push(false);
        newTask.value="";
        //otherwise won't display new task
        updateTodoList();
    }

};

const updateTodoList = () => {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";
    for (const [index, task] of todoTasks.entries ()) {
        const newTodoTaskListElement = createNewTodoItemElement(task, index);
        todoList.appendChild(newTodoTaskListElement)
    }

};


const createNewTodoItemElement = (task, index) => {
    // Create a <p> element to store the task description
    const newTodoTaskTextElement = document.createElement("p");
    newTodoTaskTextElement.innerText = task;

    // Apply a CSS class to the completed items
    if (todoTasksStatus[index] == true){
        newTodoTaskTextElement.classList.add("complete");
    }

    // Create a <li> element to contain the paragraph
    const newTodoTaskElement = document.createElement("li");
    newTodoTaskElement.appendChild(newTodoTaskTextElement);



    // Adding a button to mark each item as complete
const completeButtonElement = document.createElement("input");
    completeButtonElement.type = "button";
    completeButtonElement.value = "Complete";
    completeButtonElement.onclick = () => {
        toggleComplete(index);
       //newTodoTaskElement.appendChild(completeButtonElement)
    };
        newTodoTaskElement.appendChild(completeButtonElement);
        return newTodoTaskElement;
};

const toggleComplete = (index) => {
    //if it is complete, set it to incomplete or vice versa
    if (todoTasksStatus[index] == false) {
        todoTasksStatus[index] = true; 
    } else {
    todoTasksStatus[index] = false;
}
console.log(todoTasksStatus);
updateTodoList();
    
};

let todoTasks = ["Clean Freya's Litter", "Make Dinner"];
let todoTasksStatus = [false,true];
updateTodoList();
// const todoList = document.getElementById("todo-list");



for (const [index, task] of todoTasks.entries()) {
    // // Create a <p> element to store the task description
    // const newTodoTaskTextElement = document.createElement("p");
    // newTodoTaskTextElement.innerText = task;

    // //Apply a CSS class to the completed iteams
    // if (todoTasksStatus[index]==true) {
    //     newTodoTaskTextElement.classList.add("complete")
    // }

    // //Create a <li> element to contain the paragraph
    // const newTodoTaskElement = document.createElement("li");
    // newTodoTaskElement.appendChild(newTodoTaskTextElement);

    // //Adding a button to mark each item as complete
    // const completeButtonElement = document.createElement("input");
    // completeButtonElement.type = "button";
    // completeButtonElement.value = "Completed";
    // completeButtonElement.onclick = function () {
    //     toggleComplete(index);
    // }
    // newTodoTaskElement.appendChild(completeButtonElement)
const newTodoTaskElement = createNewTodoItemElement(task, index);

    // Add the <li> element to list
    todoList.appendChild(newTodoTaskElement);

}







