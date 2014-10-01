$(document).ready(function() { 
  'use strict';

// Model

  var TodoModel = Backbone.Model.extend({

    defaults: function() {
      return {
        title: " ",
        done: false
      };
    },

    toggle: function() {
      this.save({
        done: !this.get("done")
      });
    }

  });



  // Collection

  var TodoCollection = Backbone.Collection.extend({

    model: TodoModel,

    localStorage: new Backbone.LocalStorage("todos-backbone"),

    done: function() {
      return this.filter(function(todo){ 
        return todo.get('done'); 
      });
    },

    remaining: function() {
      return this.without.apply(this, this.done());
    },

  });

 var todoCollection = new TodoCollection;



  // View

  var TodoView = Backbone.View.extend({

    tagName:  "li",

    template: _.template($('#item-template').html()),

    events: {
      "click .toggle"   : "toggleDone",
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('done', this.model.get('done'));
      return this;
    },

    toggleDone: function() {
      this.model.toggle();
    },

  });



  // View

  var AppView = Backbone.View.extend({

    el: $("#todoapp"),

    removeTemplate: _.template($('#remove-template').html()),

    events: {
      "keypress #new-todo":  "createOnEnter",
      "click #clear-completed": "clearCompleted",
    },

    initialize: function() {

      this.input = this.$("#new-todo");
      this.allCheckbox = this.$("#toggle-all")[0];

      this.listenTo(todoCollection, 'add', this.addOne);
      this.listenTo(todoCollection, 'reset', this.addAll);
      this.listenTo(todoCollection, 'all', this.render);

      this.footer = this.$('footer');
      this.main = $('#main');

      todoCollection.fetch();
    },

    render: function() {
      var done = todoCollection.done().length;
      var remaining = todoCollection.remaining().length;

      if (todoCollection.length) {
        this.main.show();
        this.footer.show();
        this.footer.html(this.removeTemplate({done: done, remaining: remaining}));
      } else {
        this.main.hide();
        this.footer.hide();
      }
    },

    addOne: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
    },

    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;

      todoCollection.create({title: this.input.val()});
      this.input.val('');
    },

    clearCompleted: function() {
      _.invoke(todoCollection.done(), 'destroy');
      return false;
    },

  });

  var App = new AppView;

});
