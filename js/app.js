$(function() {
  var newCardPopup  = $('#new_card_popup'),
    TaskBoard       = window.TaskBoard,
    Card            = TaskBoard.Card,
    CardsController = TaskBoard.CardsController;

  function bindDomEvents() {
    $('.columns .span4').sortable({
      placeholder: 'ui-state-highlight card well',
      connectWith: '.column',
      receive: function(event, ui) {
        var newState = ui.item.parents('.column').data('state'),
            card = ui.item.data('card');

        card.updateState(newState);
      }
    }).disableSelection();

    $('.create-new-task').on('click', CardsController.addNewCard);
    newCardPopup.find('form').on('submit', function(event) {
      event.preventDefault();
      CardsController.addNewCard();
    });
  }

  bindDomEvents();

  var savedCards = Card.loadSavedCards();
  for (var i=savedCards.length - 1; i >= 0; i--) CardsController.appendCardToDom(savedCards[i]);
});
