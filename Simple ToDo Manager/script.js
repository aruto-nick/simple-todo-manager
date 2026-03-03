// DOM
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const listEl = document.getElementById("todo-list");
const remainingEl = document.getElementById("remaining-count");

// State
let todos = loadTodos(); //起動時に復元

//起動時にまず描画
render();

//追加
form.addEventListener("submit",(e) =>{
    e.preventDefault();

    const title = input.value.trim();
    if(title === "")return;

    const todo = {
        id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
        title,
        completed:false,
        createdAt:Date.now(),
    };
    
    todos.push(todo);
    saveTodos(todos);
    render();

    input.value = "";
    input.focus();
});

//保存・読み込み
function saveTodos (todos){
    localStorage.setItem("todos",JSON.stringify(todos));
}

function loadTodos (){
    const json = localStorage.getItem("todos")
    if (!json) return[];
    try {
        const data = JSON.parse(json);
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

//描画
function render (){
    //1)リストを空にする
    listEl.innerHTML = "";

    //2)todosを表示
    for (const todo of todos){
        const li = document.createElement("li");
        li.textContent = todo.title;
        listEl.appendChild(li);
    }

    //3)残り件数
    const remaining = todos.filter((t) => !t.completed).length;
    remainingEl.textContent = String(remaining);
}