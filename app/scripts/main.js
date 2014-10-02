'use strict';

// Model 

var Todo = Backbone.Model.extend({});


// Collection 

var TodoCollection = Backbone.Collection.extend({

  model: Todo

});


// Input View 

var InputView = Backbone.View.extend({

  tagName: 'input',

  className: 'search',

  attributes: {
    type: 'text'
  },

  events: {
    'keyup': 'addListItems',
  },

  addListItems: function(event){
    if(event.keyCode === 13) {
      var todoItem = this.collection.add({title: this.$el.val()}); 
    };
  },

  render: function() {
    $('.todos').prepend(this.el);
  }

});


// List View 

var TodoListView = Backbone.View.extend({

  tagName: 'ul',

  className: 'todoList',

  initialize: function(){
    $('.todos').append(this.el);
  },

});


// Item View 

var TodoItemView = Backbone.View.extend({
  tagName: 'li',

  events: {
    'click .delete': 'deleteItem'
  },

  render: function() {
    $('.todoList').append(this.el);
    this.listenTo(this.collection, 'add', function(todoItem) {
      this.$el.append('<li>' + '<input type="checkbox" class="checked"> ' + '<label>' + todoItem.get('title') + '</label>' + '<button class="delete">delete</button>' + '</li>');
    });
  },

  deleteItem: function(){
    this.$el.remove();
  }

});


$(document).ready(function(){
  var todos = new TodoCollection();

  var inputView = new InputView({collection: todos});
  inputView.render();

  var todoListView = new TodoListView({collection: todos});

  var todoItemView = new TodoItemView({collection: todos});
  todoItemView.render();
  
})

