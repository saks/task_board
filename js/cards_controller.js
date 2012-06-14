$(function() {
  var TaskBoard           = window.TaskBoard, CardController,
    nameValidationMessage = $('#name_validation_message'),
    newCardPopup          = $('#new_card_popup'),
    renderCard            = Handlebars.compile($("#card-template").html()),
    Card                  = TaskBoard.Card;


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
    var html = $(renderCard(card));
    html.data('card', card);
    $('.column.' + card.state).append(html);
  }

  function createCard() {
    var data = newCardPopup.find('form').serializeArray(),
        card = new Card({name: data[0].value, type: data[1].value});

    Card.store(card);
    appendCardToDom(card);

    newCardPopup.find('form')[0].reset();
    newCardPopup.modal('hide');
  }

  CardsController = TaskBoard.CardsController = {
    addNewCard:      addNewCard,
    appendCardToDom: appendCardToDom,
    createCard:      createCard
  };

});
