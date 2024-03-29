(function(globalNamespace) {
  var TaskBoard        = globalNamespace.TaskBoard, Card,
      UUID             = 0,
      fieldSeparator   = '$$$',
      storageNamespace = 'cards';

  /**
   * @constructor
   */
  var Card = TaskBoard.Card = function(attributes) {
    var id = attributes.id;

    this.name = attributes.name;
    this.type = attributes.type;

    if ('id' in attributes)
      UUID = id
    else
      id = ++UUID;

    this.id = id;

    if ('state' in attributes)
      this.state = attributes.state
    else
      this.state = 'todo';
  }

  Card.prototype.updateState = function(newState) {
    this.state = newState;
    this.save()
  }

  Card.prototype.save = function() {
    Card.store(this)
    return this
  }

  /**
   * @public
   */
  Card.store = function(instance) {
    if ( !('localStorage' in window) ) return

    var key   = [storageNamespace, instance.id].join(':'),
        value = __dump__(instance);

    window.localStorage.setItem(key, value);
  }

  /**
   * @public
   */
  Card.loadLocallySavedCards = function() {
    if (!window.localStorage) return

    var keyPrefix = storageNamespace + ':', data, value, key, id, cards = [];


    for (i = 0; i <= localStorage.length - 1; i++) {
      key = localStorage.key(i);

      if ( keyPrefix === key.slice(0, keyPrefix.length) ) {
        value = window.localStorage.getItem(key);

        if (null === value) continue;

        data  = __parse__(value);
        id    = parseInt(key.slice(keyPrefix.length, key.length), 10);

        cards.push( new Card({name: data[0], type: data[1], id: id, state: data[2]}) );
      }
    }

    return cards
  }

  Card.loadSavedCards = function() {
    var index = {},
        local = Card.loadLocallySavedCards(),
        fromFile = window.StoredCards;

    // cards from local storage take presedence
    for (var i = 0, card; i < fromFile.length; i++) {
      card = fromFile[i];
      index[card.id] = new Card(card).save();
    }

    for (var i = 0, card; i < local.length; i++) {
      card = local[i];
      index[card.id] = new Card(card).save();
    }

    return index
  };

  function __dump__(instance) {
    return [instance.name, instance.type, instance.state].join(fieldSeparator);
  }

  function __parse__(string) {
    return string.split(fieldSeparator);
  }

})(window);
