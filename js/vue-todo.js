var filters = {
  all: function (todos) {
    return todos;
  },
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed;
    });
  },
  completed: function (todos) {
    return todos.filter(function (todo) {
      return todo.completed;
    });
  },
};

var todos_storage = {
  fetch: function () {
    return JSON.parse(localStorage.getItem("todos") || "[]");
  },
  save: function (todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
  },
};

var todoApp = new Vue({
  el: ".todoapp",
  data: {
    newTodo: "",
    visibility: "all",
    editingTodo: null,
    oldEditingTodoTitle: "",
    todos: todos_storage.fetch(),
  },
  methods: {
    deleteTodo: function (todo) {
      this.todos.splice(this.todos.indexOf(todo), 1);
    },
    addTodo: function () {
      if (this.newTodo && this.newTodo.trim()) {
        this.todos.push({
          title: this.newTodo,
          completed: false,
        });
        this.newTodo = "";
      }
    },
    removeCompleted: function () {
      this.todos = filters.active(this.todos);
    },
    editTodo: function (todo) {
      this.editingTodo = todo;
      this.oldEditingTodoTitle = todo.title;
    },
    doneEditing: function () {
      this.editingTodo.title = this.editingTodo.title.trim();

      if (!this.editingTodo.title) {
        this.deleteTodo(this.editingTodo);
      }

      this.editingTodo = null;
    },
    cancelEditing: function () {
      this.editingTodo.title = this.oldEditingTodoTitle;
      this.editingTodo = null;
    },
  },
  computed: {
    filteredTodos: function () {
      return filters[this.visibility](this.todos);
    },
    remaining: function () {
      return filters.active(this.todos).length;
    },
    remainingText: function () {
      return filters.active(this.todos).length > 1 ? "items" : "item";
    },
    allDone: {
      get: function () {
        return this.remaining === 0;
      },
      set: function (value) {
        this.todos.forEach(function (todo) {
          todo.completed = value;
        });
      },
    },
  },
  watch: {
    todos: {
      handler: function (todos) {
        todos_storage.save(todos);
      },
      deep: true,
    },
  },
});
