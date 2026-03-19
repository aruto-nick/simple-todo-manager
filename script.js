// DOM
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const listEl = document.getElementById("todo-list");
const remainingEl = document.getElementById("remaining-count");

// State
let todos = loadTodos(); //起動時に復元

let currentFilter = "all"; //どのフィルタを使うか

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

//配列の作成
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


function deleteTodo(id) {
    // 配列を更新→条件に合うものだけ残す
    todos = todos.filter((t) => t.id !== id);
    // todos配列の保存
    saveTodos(todos);
    // 画面の更新
    render();
}

function render() {
  renderList();
  renderCount();
  renderFilter();
}

//関数：「一覧」機能
function renderList () {

    //フィルター配列の作成
    let filterTodos = todos ;

    //判定機能：active　→　未完了、completed　→　完了
    if (currentFilter === "active"){
      filterTodos = todos.filter(todo => !todo.completed);
    }else if (currentFilter === "completed"){
      filterTodos = todos.filter (todo => todo.completed);
    }

    //予めタスク名表示部分を「空に」する
    listEl.innerHTML = "";

    //タスク名の表示
    filterTodos.forEach(todo => {
      const li = document.createElement("li")
      li.textContent = todo.title;
      listEl.appendChild("li");
    })
}

//関数：「件数」機能
function renderCount (){
  const remaining = todos.filter(todo => !todo.completed).length;
  remainingEl.textContent = remaining;
}

//関数：「ボタンUI」機能　→　クリックされたボタンによってcssを変更
function renderFilter (){
  document.querySelectorAll("[data-filter").forEach(button => {
    if(button.dataset.filter === currentFilter){
      button.classList.add("active");
    }else{
      button.classList.remove("active");
    }
  });
}