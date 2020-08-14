// Make sure we're modifying the correct version of Leaflet
/*if (L.version !== '0.7.2') {
  throw new Error('Attempting to patch Leaflet ' + L.version + '. Only 0.7.2 is supported');
}*/

// Modify Draggable to ignore shift key. 
L.Draggable.prototype._onDown = function(e) {
  this._moved = false;

  if ((e.which !== 1) && (e.button !== 1) && !e.touches) { return; }

  L.DomEvent.stopPropagation(e);

  if (L.Draggable._disabled) { return; }

  L.DomUtil.disableImageDrag();
  L.DomUtil.disableTextSelection();

  if (this._moving) { return; }

  var first = e.touches ? e.touches[0] : e;

  this._startPoint = new L.Point(first.clientX, first.clientY);
  this._startPos = this._newPos = L.DomUtil.getPosition(this._element);

  L.DomEvent
      .on(document, L.Draggable.MOVE[e.type], this._onMove, this)
      .on(document, L.Draggable.END[e.type], this._onUp, this);
};