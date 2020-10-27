(function() {
  'use strict';

/*
--------------------------------------------------------------------------------
DATA
--------------------------------------------------------------------------------
*/

const lists = [
  {
    title: 'My List',
    tasks: ['Do your homework', 'Go to school', 'Eat dinner', 'Go to the gym', 'Write in journal']
  },
  {
    title: 'Your List',
    tasks: ['Go shopping', 'Go to soccer game']
  }
];

/*
--------------------------------------------------------------------------------
FUNCTIONS
--------------------------------------------------------------------------------
*/

const generateItem = function(value) {
  const $itemDiv = $('<div>').addClass('item');
  const $li = $('<li>').text(value);

  $itemDiv.append($li);

  return $itemDiv;
}

const createEditForm = function(value) {
  const $container = $('<div>').addClass('edit-container');
  const $editDiv = $('<div>').addClass('edit-form');
  const $textarea = $('<textarea>')
    .attr('autocomplete', 'off')
    .attr('wrap', 'soft')
    .attr('autofocus', null)
    .text(value);
  const $deleteButton = $('<button>').addClass('btn del-item-btn');
  const $delI = $('<i>').addClass('fa fa-trash');
  const $buttonsDiv = $('<div>').addClass('edit-form-btns');
  const $saveBtn = $('<button>')
    .attr('type', 'submit')
    .addClass('btn save-btn')
    .text('Save');
  const $exitBtn = $('<button>').addClass('exit-edit-btn');
  const $exitI = $('<i>').addClass('fa fa-times');

  $deleteButton.append($delI);
  $exitBtn.append($exitI);
  $buttonsDiv.append($saveBtn);
  $buttonsDiv.append($exitBtn);
  $editDiv.append($textarea);
  $editDiv.append($buttonsDiv);
  $container.append($editDiv);
  $container.append($deleteButton);

  return $container;
};

const createAddForm = function() {
  const $toolsDiv = $('<div>').addClass('tools');
  const $form = $('<form>');
  const $textarea = $('<textarea>')
    .attr('wrap', 'soft')
    .attr('placeholder', 'Add item')
    .attr('autocomplete', 'off')
    .attr('autofocus', null);
  const $buttonDiv = $('<div>').addClass('add-form-btns');
  const $button = $('<button>')
    .attr('type', 'submit')
    .addClass('btn add-btn')
    .text('Add');
  const $exit = $('<button>').addClass('btn exit-add-btn');
  const $i = $('<i>').addClass('fa fa-times');

  $exit.append($i);
  $buttonDiv.append($button);
  $buttonDiv.append($exit);
  $form.append($textarea);
  $form.append($buttonDiv);
  $toolsDiv.append($form);

  return $toolsDiv;
}

const createAddPrompt = function() {
  const $button = $('<button>').addClass('add-item').text('Add an item...');

  return $button;
}

const createList = function(list) {
  const $listDiv = $('<div>').addClass('list');
  const $headerDiv = $('<div>').addClass('list-header');
  const $h2 = $('<h2>').text(list.title);
  const $delBtn = $('<button>').addClass('btn del-list-btn');
  const $delI = $('<i>').addClass('fa fa-trash');
  const $list = $('<ul>');

  $delBtn.append($delI);
  $headerDiv.append($h2);
  $headerDiv.append($delBtn);
  $listDiv.append($headerDiv);

  for (const item of list.tasks) {
    const $divContainer = generateItem(item);

    $list.append($divContainer);
  }

  $listDiv.append($list);
  $listDiv.append(createAddPrompt());

  return $listDiv;
}

const populateLists = function(lists) {
  for (const list of lists) {
    const $list = createList(list);

    $('.all-lists').append($list);
  }
}

populateLists(lists);

const deleteItem = function() {
  $(this).parents('.item').remove();
}

const inHover = function() {
  if ($(this).hasClass('editing')) {
    return;
  }

  const $button = $('<button>');
  const $i = $('<i>');

  $i.addClass('fa');
  $i.addClass('fa-pencil');
  $button.append($i);
  $button.addClass('btn edit-btn');
  $(this).append($button);
}

const outHover = function() {
  $('.edit-btn').remove();
}

/*
--------------------------------------------------------------------------------
LISTENERS
--------------------------------------------------------------------------------
*/

// Create new list
$('.new-list').on('click', '.list-btn', (e) => {
  e.preventDefault();

  const title = $(e.target).siblings('input').val();
  const list = { title, tasks: [] };
  const $newList = createList(list);

  $(e.target).siblings('input').val('');
  $('.all-lists').append($newList);
});

// Delete list
$('.all-lists').on('click', '.del-list-btn', (e) => {
  $(e.target).parents('.list').remove();
});

// Delete item on list
$('.all-lists').on('click', '.del-item-btn', deleteItem);

// Highlight item and show icon/button on hover
$('.all-lists').on('mouseenter', '.item', inHover);
$('.all-lists').on('mouseleave', '.item', outHover);

// Edit item on list
$('.all-lists').on('click', '.edit-btn', (e) => {
  const $item = $(e.target).parents('.item');
  const val = $item.children('li').text();
  const $editForm = createEditForm(val);

  $item.children('button').remove();
  $item.append($editForm);
  $item.addClass('editing');
  $item.children('li').remove();
});

$('.all-lists').on('click', '.save-btn', (e) => {
  const $item = $(e.target).parents('.item');
  const val = $(e.target).parents('.edit-form').children('textarea').val();
  const $li = $('<li>').text(val);

  $item.children().remove();
  $item.removeClass('editing');
  $item.append($li);
});

$('.all-lists').on('click', '.exit-edit-btn', (e) => {
  const $item = $(e.target).parents('.item');
  const text = $(e.target).parents('.edit-form').children('textarea').text();
  const $li = $('<li>').text(text);

  $item.children().remove();
  $item.removeClass('editing');
  $item.append($li);
});


// Add item to list
$('.all-lists').on('click', 'button.add-item', (e) => {
  const $list = $(e.target).parents('.list');

  $(e.target).remove();
  $list.append(createAddForm());
});

$('.all-lists').on('click', '.add-btn', (e) => {
  e.preventDefault();

  const val = $(e.target).parents('.add-form-btns').siblings('textarea').val();
  const $item = generateItem(val);

  $(e.target).parents('.list').children('ul').append($item);

  $(e.target).parents('.list').append(createAddPrompt());
  $(e.target).parents('.tools').remove();
});

$('.all-lists').on('click', '.exit-add-btn', (e) => {
  e.preventDefault();

  $(e.target).parents('.list').append(createAddPrompt());
  $(e.target).parents('.tools').remove();
});

})();
