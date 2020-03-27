import {
  asTRBL,
  getOrientation,
  roundPoint
} from '../layout/LayoutUtil';

import {
  center,
  delta
} from './PositionUtil';


/**
 * Calculates the absolute point relative to the new element's position
 *
 * @param {point} point [absolute]
 * @param {bounds} oldBounds
 * @param {bounds} newBounds
 *
 * @return {point} point [absolute]
 */
export function getNewAttachPoint(point, oldBounds, newBounds) {
  var oldCenter = center(oldBounds),
      newCenter = center(newBounds),
      oldDelta = delta(point, oldCenter);

  var newDelta = {
    x: oldDelta.x * (newBounds.width / oldBounds.width),
    y: oldDelta.y * (newBounds.height / oldBounds.height)
  };

  return roundPoint({
    x: newCenter.x + newDelta.x,
    y: newCenter.y + newDelta.y
  });
}


/**
 * Calculates the shape's delta relative to a new position
 * of a certain element's bounds
 *
 * @param {djs.model.Shape} point [absolute]
 * @param {bounds} oldBounds
 * @param {bounds} newBounds
 *
 * @return {delta} delta
 */
export function getNewAttachShapeDelta(shape, oldBounds, newBounds) {
  var shapeCenter = center(shape),
      oldCenter = center(oldBounds),
      newCenter = center(newBounds),
      shapeDelta = delta(shape, shapeCenter),
      oldCenterDelta = delta(shapeCenter, oldCenter);

  if (!shouldBeMoved(shapeCenter, oldBounds, newBounds)) {
    return {
      x: 0,
      y: 0
    };
  }

  var newCenterDelta = {
    x: oldCenterDelta.x * (newBounds.width / oldBounds.width),
    y: oldCenterDelta.y * (newBounds.height / oldBounds.height)
  };

  var newShapeCenter = {
    x: newCenter.x + newCenterDelta.x,
    y: newCenter.y + newCenterDelta.y
  };

  return roundPoint({
    x: newShapeCenter.x + shapeDelta.x - shape.x,
    y: newShapeCenter.y + shapeDelta.y - shape.y
  });
}

/**
 * Check if attachment should be moved with its resized/replaced host.
 *
 * @param {Point} attachmentPoint
 * @param {Bounds} oldBounds
 * @param {Bounds} newBounds
 */
function shouldBeMoved(attachmentPoint, oldBounds, newBounds) {
  var oldOrientation = getOrientation(oldBounds, attachmentPoint),
      newOrientation = getOrientation(newBounds, attachmentPoint),
      oldTRBL = asTRBL(oldBounds),
      newTRBL = asTRBL(newBounds);

  // (1) Check if attachment is placed on host or orientation has been changed.
  if (newOrientation === 'intersect' || newOrientation !== oldOrientation) {
    return true;
  }

  // (2) Check if relevant edge has been moved.
  switch (oldOrientation) {
  case 'top':
    return oldTRBL.bottom !== newTRBL.bottom;
  case 'right':
    return oldTRBL.left !== newTRBL.left;
  case 'bottom':
    return oldTRBL.top !== newTRBL.top;
  case 'left':
    return oldTRBL.right !== newTRBL.right;
  }

  // shape should be moved per default
  return true;
}
