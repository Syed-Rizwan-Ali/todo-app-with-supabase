const { createClient } = supabase;

const SUPABASE_URL = "https://leloaggystxctoebnawo.supabase.co";
const SUPABASE_KEY = "sb_publishable_ueavhpW7eecmGJ9uHVGoDA_WQe7xsh-";

const db = createClient(SUPABASE_URL, SUPABASE_KEY);

const input = document.querySelector("#todo-input");
const ul = document.querySelector("#todo-list");

async function showTodos() {
  ul.innerHTML = "<li>Loading todos...</li>";

  const { data, error } = await db
    .from("todos")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading todos:", error);
    ul.textContent = "Could not load todos. Check the console.";
    return;
  }

  ul.innerHTML = "";

  data.forEach((item) => {
    const li = document.createElement("li");

    const contentWrapper = document.createElement("div");
    contentWrapper.style.display = "flex";
    contentWrapper.style.alignItems = "center";
    contentWrapper.style.gap = "12px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.is_completed || false;
    checkbox.addEventListener("change", () => {
      toggleTodo(item.id, item.is_completed);
    });

    const text = document.createElement("span");
    text.textContent = item.todo;
    if (item.is_completed) {
      text.classList.add("completed");
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "delete";
    deleteButton.addEventListener("click", () => {
      deleteTodo(item.id);
    });

    contentWrapper.append(checkbox, text);
    li.append(contentWrapper, deleteButton);
    ul.appendChild(li);
  });
}

async function toggleTodo(id, currentStatus) {
  const { error } = await db
    .from("todos")
    .update({ is_completed: !currentStatus })
    .eq("id", id);

  if (error) {
    console.error("Error updating todo status:", error);
    alert("Could not update todo status. Please try again.");
    return;
  }

  await showTodos();
}

async function addTodo(event) {
  event.preventDefault();

  const todoText = input.value.trim();

  if (!todoText) return;

  const { error } = await db.from("todos").insert({ todo: todoText });

  if (error) {
    console.error("Error adding todo:", error);
    alert("Could not add todo. Please try again.");
    return;
  }

  input.value = "";
  await showTodos();
}

async function deleteTodo(id) {
  const { error } = await db.from("todos").delete().eq("id", id);

  if (error) {
    console.error("Error deleting todo:", error);
    alert("Could not delete todo. Please try again.");
    return;
  }

  await showTodos();
}

showTodos();
