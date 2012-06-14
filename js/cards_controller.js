(function(globalNamespace) {
  var TaskBoard           = globalNamespace.TaskBoard, CardController,
    nameValidationMessage = $('#name_validation_message'),
    newCardPopup          = $('#new_card_popup'),
    renderCard            = Handlebars.compile($("#card-template").html());

  CardsController = TaskBoard.CardsController = {

    addNewCard: function() {
      var controlsGroup = newCardPopup.find('.control-group.name');

      if ('' === newCardPopup.find('form')[0].name.value) {
        nameValidationMessage.show();
        controlsGroup.addClass('error');
      } else {
        nameValidationMessage.hide();
        controlsGroup.removeClass('error');
        createCard();
      }
    },

    appendCardToDom: function(card) {
      var html = $(renderCard(card));
      html.data('card', card);
      $('.column.todo').append(html);
    },

    createCard: function() {
      var data = newCardPopup.find('form').serializeArray(),
        card = new Card(data[0].value, data[1].value);

      Card.store(card);
      appendCardToDom(card);

      newCardPopup.find('form')[0].reset();
      newCardPopup.modal('hide');
    },
  };

})(window);
