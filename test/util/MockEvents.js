'use strict';

var assign = require('min-dash').assign;

var EventBus = require('../../lib/core/EventBus');

var TestHelper = require('../helper');


/**
 * Create an event with global coordinates
 * computed based on the loaded diagrams canvas position and the
 * specified canvas local coordinates.
 *
 * @param {Point} point of the event local the canvas (closure)
 * @param {Object} data
 *
 * @return {Event} event, scoped to the given canvas
 */
function createCanvasEvent(position, data) {

  return TestHelper.getDiagramJS().invoke(function(canvas) {

    var target = canvas._svg;

    var clientRect = canvas._container.getBoundingClientRect();

    var absolutePosition = {
      x: position.x + clientRect.left,
      y: position.y + clientRect.top
    };

    return createEvent(target, absolutePosition, data);
  });
}

module.exports.createCanvasEvent = createCanvasEvent;


function createEvent(target, position, data) {

  data = assign({
    target: target,
    clientX: position.x,
    clientY: position.y,
    offsetX: position.x,
    offsetY: position.y
  }, data || {});

  var event = new EventBus.Event();

  event.init(data);

  return event;
}

module.exports.createEvent = createEvent;