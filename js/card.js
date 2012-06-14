(function(globalNamespace) {
  var TaskBoard = globalNamespace.TaskBoard, Card, UUID = 0;

  /**
   * @constructor
   */
  var Card = TaskBoard.Card = function(name, type, id) {
    this.name = name;
    this.type = type;

    if ('undefined' === typeof id)
      id = ++UUID
    else
      UUID = id + 1

    this.id = id;
  }

  /**
   * @public
   */
  Card.store = function(instance) {
    if ( !('localStorage' in window) ) return

    var key   = [this.storageNamespace, instance.id].join(':'),
        value = this.__dump__(instance);

    window.localStorage.setItem(key, value);
  }

  /**
   * @public
   */
  Card.loadSavedCards = function() {
    var keyPrefix = this.storageNamespace + ':', data, value, key, id, cards = [];


    for (i = 0; i <= localStorage.length - 1; i++) {
      key = localStorage.key(i);

      if ( keyPrefix === key.slice(0, keyPrefix.length) ) {
        value = window.localStorage.getItem(key);

        if (null === value) continue;

        data  = this.__parse__(value);
        id    = parseInt(key.slice(keyPrefix.length, key.length), 10);

        cards.push( new Card(data[0], data[1], id) );
      }
    }

    return cards
  }

  Card.fieldSeparator = '$$$';
  Card.storageNamespace = 'cards';

  Card.__dump__ = function(instance) {
    return [instance.name, instance.type].join(this.fieldSeparator);
  }

  Card.__parse__ = function(string) {
    return string.split(this.fieldSeparator);
  }

})(window);
