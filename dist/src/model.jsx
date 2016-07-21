/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

(function () {
        'use strict';

        const Utils = app.Utils;

        //Setup RethinkDB
        const horizon = Horizon();

        // Generic "model" object. You can use whatever
        // framework you want. For this application it
        // may not even be worth separating this logic
        // out, but we do this to demonstrate one way to
        // separate out parts of your application.
        app[table_key] = function (table_key) {
                this.todos = [];
                this.onChanges = [];
                this.todosDB = horizon(table_key);
        };

        var model = app[table_key];

        model.prototype.subscribe = function (onChange) {
                this.onChanges.push(onChange);
        };

        model.prototype.inform = function () {
                this.onChanges.forEach(function (cb) { cb(); });
        };

        model.prototype.addTodo = function (title) {
                const newTodo = {
                        id: Utils.uuid(),
                        title: title,
                        completed: false
                };

          this.todosDB.store(newTodo);
        };

        model.prototype.toggleAll = function (checked) {
                console.log(checked);
                this.todosDB.replace(this.todos.map(function (todo) {
                        return Utils.extend({}, todo, {completed: checked});
                }));
        };

        model.prototype.toggle = function (todoToToggle) {
                console.log(todoToToggle);
                this.todosDB.replace(
                        Utils.extend({}, todoToToggle, {completed: !todoToToggle.completed})
                );
        };

        model.prototype.destroy = function (todo) {
            this.todosDB.remove(todo);
        };

        model.prototype.save = function (todoToSave, text) {
          this.todosDB.store(Utils.extend({}, todoToSave, {title: text}));
        };

        model.prototype.clearCompleted = function () {
                const oldTodos = this.todos.slice();

                this.todos = this.todos.filter((todo) => {
                        return !todo.completed;
                });

                // Send batched deletion of completed todos
                this.todosDB.removeAll(oldTodos.filter((todo) => {
                        return !this.todos.includes(todo);
                }));
        };

        model.prototype.subscribeChangefeeds = function(){
                this.todosDB.watch().subscribe(todos => {
                  this.todos = todos;
                  this.inform()
                })
        };
})();