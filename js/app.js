$(function() {
  var renderCard          = Handlebars.compile($("#card-template").html()),
    UUID                  = 0,
    newCardPopup          = $('#new_card_popup'),
    nameValidationMessage = $('#name_validation_message');

  $('.columns .span4').sortable({
    placeholder: 'ui-state-highlight card well',
		connectWith: '.column'
  }).disableSelection();

  $('.create-new-task').on('click', addNewCard);
  newCardPopup.find('form').on('submit', function(event) {
    event.preventDefault();
    addNewCard();
  });

  function addNewCard() {
    var controlsGroup = newCardPopup.find('.control-group.name');

    if ('' === newCardPopup.find('form')[0].name.value) {
      nameValidationMessage.show();
      controlsGroup.addClass('error');
    } else {
      nameValidationMessage.hide();
      controlsGroup.removeClass('error');
      createCard();
    }
  }

  function appendCardToDom(card) {
    $('.column.todo').append( renderCard(card) );
  }

  function createCard() {
    var data = newCardPopup.find('form').serializeArray(),
      card = new Card(data[0].value, data[1].value);

    Card.store(card);
    appendCardToDom(card);

    newCardPopup.find('form')[0].reset();
    newCardPopup.modal('hide');
  };

  function Card(name, type, id) {
    this.name = name;
    this.type = type;

    if ('undefined' === typeof id)
      id = ++UUID
    else
      UUID = id + 1

    this.id = id;
  }

  Card.store = function(instance) {
    if ( !('localStorage' in window) ) return

    var key   = [this.storageNamespace, instance.id].join(':'),
        value = this.__dump__(instance);

    window.localStorage.setItem(key, value);
  }

  Card.loadSavedCards = function() {
    var keyPrefix = this.storageNamespace + ':', data, value, key, id;


    for (i = 0; i <= localStorage.length - 1; i++) {
      key = localStorage.key(i);

      if ( keyPrefix === key.slice(0, keyPrefix.length) ) {
        value = window.localStorage.getItem(key);

        if (null === value) continue;

        data  = this.__parse__(value);
        id    = parseInt(key.slice(keyPrefix.length, key.length), 10);

        appendCardToDom( new Card(data[0], data[1], id) );
      }
    }
  }

  Card.fieldSeparator = '$$$';
  Card.storageNamespace = 'cards';

  Card.__dump__ = function(instance) {
    return [instance.name, instance.type].join(this.fieldSeparator);
  }

  Card.__parse__ = function(string) {
    return string.split(this.fieldSeparator);
  }

  Card.loadSavedCards();
});
