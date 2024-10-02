const addBtn = document.querySelector('#addBtn');
const taskList = document.querySelector('#taskList');
const serverUrl = 'http://localhost:3000/tasks';
class Task {
    constructor(title, details, date, isDone = false) {
        this.title = title;
        this.details = details;
        this.date = date;
        this.isDone = isDone;
    }
}
let savedTask = null, taskCollection = {}, taskSeq = [];

addBtn.addEventListener('click', createNewTask);

document.addEventListener('focusin', () => {
    // console.log(document.activeElement);
    // console.log("focus in")
    let active = document.activeElement;
    let parent = active.parentElement;
    console.log(parent,active,savedTask);
    if (savedTask != active && savedTask != parent && !(active.tagName == 'INPUT' && active.type == 'checkbox')) {
        
        console.log("inside if");
        if (savedTask) {
            // console.log("focused")
            submitPreviousTask();
        }
        if (parent.tagName == 'LI') {
            //will add some css
            selectTask(parent);

        }
        else if (active.tagName == 'LI') {
            selectTask(active);
            active.firstChild.focus();
        }
    }

})
document.body.addEventListener('click', (e) => {
    if (savedTask && (e.target.id == 'taskBox' || e.target.tagName == 'OL')) {
        console.log("clicked outside")
        submitPreviousTask();
    }
});

// initial code
(async function () {
    taskCollection = JSON.parse(localStorage.getItem('taskCollection')) || {};
    taskSeq = JSON.parse(localStorage.getItem('taskSeq')) || [];
    if(Object.keys(taskCollection).length == 0){
        let response = await fetch(serverUrl);
        let {taskCollection:tc, taskSeq:ts} = await response.json();
        taskCollection = tc;
        taskSeq = ts;
        console.log(tc,ts);
        localStorage.setItem('taskCollection',JSON.stringify(taskCollection));
        localStorage.setItem('taskSeq',JSON.stringify(taskSeq));
    }
    if (taskSeq.length != 0 && Object.keys(taskCollection).length != 0)
        for (let taskId of taskSeq) {
            console.log('creating task', taskId);
            createNewTask(null, taskId, taskCollection[taskId]);
        }

})();




function createNewTask(e, id = null, task = null) {

    //create blank li
    let blankTask = createTaskDOM();
    taskList.prepend(blankTask);
    addBtn.setAttribute('disabled', '');

    if (task != null && id != null) {
        console.log("task != null")
        let inputs = blankTask.querySelectorAll('input');
        let taskKeys = ['title', 'details', 'date','isDone'];
        inputs.forEach((input, i) => {
            console.log(i);
            if(input.type == 'checkbox'){
                input.checked = task[taskKeys[i]];
                if(input.checked == true)
                    addCss(blankTask,['line-through'])
                return;
            }
            input.value = task[taskKeys[i]];
        })
        blankTask.id = id;
        addBtn.removeAttribute('disabled');
        turnOffEditing(blankTask.children);
        // console.log("returned")
        return;
    }

    savedTask = blankTask;



}

function createTaskDOM() {
    let li = document.createElement('li');
    let title = document.createElement('input');
    let details = document.createElement('input');
    let date = document.createElement('input');
    let check = document.createElement('input');
    let titleP = document.createElement('p');
    titleP.classList.add('hidden');
    let detailsP = document.createElement('p');
    detailsP.classList.add('hidden');
    let dateP = document.createElement('p');
    dateP.classList.add('hidden');

    //Styling
    li.classList.add('flex', 'flex-col', 'justify-center', 'w-full', 'max-w-lg', 'p-4', 'm-2', 'rounded-lg', 'bg-white', 'shadow-lg', 'justify-evenly', 'ring', 'transition-all', 'duration-300', 'hover:shadow-xl', 'ring-2', 'ring-gray-300')
    li.setAttribute('tabindex', '1');
    title.placeholder = 'Title';
    title.classList.add('outline-none', 'text-lg', 'font-semibold', 'border-b', 'border-gray-300', 'py-1', 'px-2', 'focus:border-blue-500', 'transition-all', 'duration-300')
    details.placeholder = 'Details';
    details.classList.add('outline-none', 'text-base', 'font-gray-600', 'border-b', 'border-gray-300', 'py-1', 'px-2', 'focus:border-blue-500', 'transition-all', 'duration-300')
    date.type = 'date';
    date.classList.add('outline-none', 'text-base', 'font-gray-600', 'border-b', 'border-gray-300', 'py-1', 'px-2', 'focus:border-blue-500', 'transition-all', 'duration-300')
    check.setAttribute('type', 'checkbox');
    check.classList.add('w-5','h-5','mt-2')

    titleP.classList.add('text-lg', 'font-semibold', 'text-gray-800', 'mt-2', 'transition', 'duration-300');
    detailsP.classList.add('text-base', 'text-gray-600', 'mt-1', 'transition', 'duration-300');
    dateP.classList.add('text-sm', 'text-gray-500', 'mt-1', 'italic', 'transition', 'duration-300');

    
    // Checkbox toggle event
    check.addEventListener('change', taskIsDoneToggle)

    li.append(title, titleP, details, detailsP, date, dateP, check);
    return li;
}

function submitPreviousTask(e) {
    addBtn.removeAttribute('disabled', '');
    savedTask.classList.remove('shadow-lg')
    if (!validate(savedTask)) {
        savedTask.innerHTML = ''
        taskList.removeChild(savedTask);
        savedTask = null;
        return;
    }
    turnOffEditing(savedTask.children);
    // console.log(savedTask);
    saveTask(savedTask);
    savedTask = null;
}

function taskIsDoneToggle(e) {
    console.log('target', e.currentTarget.parentElement)
    let id = e.currentTarget.parentElement.id;
    let taskElement = e.currentTarget.parentElement;
    //remove input and 
    if (e.currentTarget.checked) {
        turnOffEditing(taskElement.children);
        addCss(taskElement,['line-through'])
        savedTask = taskElement;
        taskCollection[id].isDone = true;
    }
    else {
        removeCss(taskElement,['line-through']);
        savedTask = null;
        taskCollection[id].isDone = false;
    }
    saveTask(taskElement);
}

function turnOffEditing(elementsArr) {
    for (let element of elementsArr) {
        if (element.tagName == 'INPUT' && element.type != "checkbox") {
            // console.log(element.nextSibling,element);
            element.nextSibling.textContent = element.value;
            element.nextSibling.classList.remove('hidden');
            element.classList.add('hidden');
        }
    }
}
function turnOnEditing(elementsArr) {
    for (let element of elementsArr)
        if (element.tagName == 'INPUT' && element.type != "checkbox") {
            element.value = element.nextSibling.textContent;
            element.nextSibling.classList.add('hidden');
            element.classList.remove('hidden');
        }
}

function validate(element) {
    for (let child of element.children) {
        if (child.tagName == 'INPUT' && child.type != 'checkbox' && child.value != null && child.value != '') {
            // console.log("validate",child)
            return true;
        }
    }
    return false;
}

function selectTask(task) {
    task.classList.add('shadow-lg');
    turnOnEditing(task.children);
    savedTask = task;
}

async function saveTask(taskElement) {

    if (!taskElement.id) {
        console.log('id set');
        taskElement.id = Date.now();
        taskSeq.push(taskElement.id);
        localStorage.setItem('taskSeq', JSON.stringify(taskSeq));
        let taskObj = new Task(taskElement.children[0].value, taskElement.children[2].value, taskElement.children[4].value);
        taskCollection[taskElement.id] = taskObj;
    }
    else{
        //updation
        let keys = ['title','details','date','isDone'];
        let i = 0;
        for(let child of taskElement.children){
            if(child == 'INPUT'){
                //save only input data
                taskCollection[taskElement.id][keys[i++]] = child.value;
            }
        }
    }
    console.log("saving this->", taskElement.id);

    //save in localstorage
    localStorage.setItem('taskCollection', JSON.stringify(taskCollection));
    //save at server
    let res = await fetch(serverUrl,{
        method:'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            taskCollection,
            taskSeq
        })
    })
    let response = await res.json();
    console.log(response);
}


function addCss(taskElement, cssArr) {
    for (let css of cssArr) {
        for (let child of taskElement.children) {
            if (child.tagName == 'P')
                child.classList.add(css);
            // console.log(child, css);
        }
    }
}
function removeCss(taskElement, cssArr) {
    for (let css of cssArr)
        for (let child of taskElement.children)
            if (child.tagName == 'P')
                child.classList.remove(css);
}
/*


function completed(e) {
    console.log('target', e.currentTarget.parentElement)
    let id = e.currentTarget.parentElement.id;
    let task = e.currentTarget.parentElement;
    //remove input and 
    if (e.currentTarget.checked) {
        replaceChild(task, 'input', 'p');
        addCss(task, ['line-through']);
    }
    else {
        // createNewTask(null,id,task[id])
        replaceChild(task, 'p', 'input');
        // turnOffEditing(task.children)
        savedTask = task;
        // addCss(task,['bg-transparent'])
        // task.addEventListener('change', completed)

        // turnOnEditing()
        // removeCss(task, ['line-through']);
    }
}

function selectElement(e) {
    selectedTask = e.currentTarget;
}

function replaceChild(task, elementFrom, elementTo) {
    let newChild;
    for (let child of task.children) {
        if (child.tagName.toLowerCase == elementFrom.toLowerCase)
            if (child.tagName == 'INPUT' && child.type != 'checkbox') {
                newChild = document.createElement(elementTo);
                newChild.textContent = child.value;
                child.replaceWith(newChild);

            }
            else if (child.tagName == 'P') {
                newChild = document.createElement(elementTo);
                newChild.value = child.innerText;
                child.replaceWith(newChild);
                newChild.classList.add('outline-none', 'read-only:bg-transparent')
            }
    }
}
*/