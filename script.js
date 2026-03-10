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

  //描画
  function render() {
    // 画面をリセット　←todo-listの中身削除
    listEl.innerHTML = "";
  
    // todosを1個ずつ取り出す
    for (const todo of todos) {

    // li要素を作成
      const li = document.createElement("li");

    //チェックボックスの作成
     const checkbox = document.createElement("input");
     checkbox.type = "checkbox";
     checkbox.checked = todo.completed;
     li.appendChild(checkbox);

    //  changeイベント(クリック→completed更新→保存→再描画)
    checkbox.addEventListener("change",() => {
      todo.completed = checkbox.checked;
      saveTodos(todos);
      render();
    });

        
    // liにタスク名を入れる
      const titleSpan = document.createElement("span");
      titleSpan.textContent = todo.title + " ";

      li.appendChild(titleSpan);
    
    // 取り消し線
      if (todo.completed){
        titleSpan.style.textDecoration = "line-through";
      }
  
    // 削除ボタンの作成
      const deleteBtn = document.createElement("button");
    //   ボタンクリック時の挙動：何もしない
      deleteBtn.type = "button";
    //ボタン内に「削除」の文字
      deleteBtn.textContent = "削除";
      // デリートボタンクリック→deleteTodo関数実行
      deleteBtn.addEventListener("click", () => deleteTodo(todo.id));
  
    // li要素の子要素に削除ボタンを入れる
      li.appendChild(deleteBtn);
    //   ulタグ(todo-list)の子要素にliを入れる
      listEl.appendChild(li);
    }
  
    const remaining = todos.filter((t) => !t.completed).length;
    remainingEl.textContent = String(remaining);
  }