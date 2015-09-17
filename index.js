var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
var bounds = {width: canvas.width, height: canvas.height};

var floors = 20;

var elevatorSize = bounds.height / floors;

// [floor][person] -> target floor
var meeple = [[], [], [], [], [],
              [], [], [], [], [],
              [], [], [], [], [],
              [], [], [], [], []];

var elevator = {
  x: bounds.width / 2 - elevatorSize / 2,
  y: 85,
  meeple: [],
  autopilot: true,
  lastDirection: 1,
  driverPower: 0,
};

function floorAtY(y) {
  return floors - Math.floor((y + elevatorSize / 2) / elevatorSize) - 1;
}

function positionForFloor(f) {
  return ((floors - 1) - f) * elevatorSize;
}

function load(e, m, up) {
  var newE = e;
  var newM = m;
  var floor = floorAtY(e.y);
  var meepleAtFloor = newM[floor];
  var [goingDown, goingUp] = splitMeeple(meepleAtFloor, floor);
  var [loading, staying] = up ? [goingUp, goingDown] : [goingDown, goingUp];
  newM[floor] = staying;
  newE.meeple = newE.meeple.concat(loading);
  meepleAtFloor.forEach(driver.callToFloor);
  return [newE, newM];
}

function unload(e) {
  var out = e;
  var floor = floorAtY(out.y);
  out.meeple = out.meeple.filter(function(m) { return m != floor; });
  return out;
}

function tick(e) {
  var out = e;

  if (out.autopilot) {
    var targetFloor = floorAtY(e.y);
    var targetPosition = positionForFloor(targetFloor);
    var difference = targetPosition - e.y;
    if (Math.abs(difference) > 2) {
      out.driverPower = e.lastDirection * 2;
    } else {
      out.driverPower = 0;
      out.autopilot = false;
      driver.arrivedAtFloor(floorAtY(e.y));
    }
  }

  if ((out.y < (canvas.height - elevatorSize) && out.driverPower > 0) ||
      (out.y > 0 && out.driverPower < 0)) {
    out.y += out.driverPower;
  }
  out.lastDirection = out.driverPower / Math.abs(out.driverPower);
  return out;
}

function paintElevator(ctx, e) {
  // car
  ctx.fillStyle = 'black';
  ctx.fillRect(e.x, e.y, elevatorSize, elevatorSize);
}

function splitMeeple(meepleAtFloor, floor) {
  return meepleAtFloor.reduce(function(u, v) {
    if (v < floor) {
      u[0].push(v);
    } else {
      u[1].push(v);
    }
    return u;
  }, [new Array(), new Array()]);
}

setInterval(function() {
  elevator = tick(elevator);
  paint(context);
}, (1 / 60) * 1000);

function randomFloor() {
  return Math.floor(Math.random() * floors);
}

function newMeepleCall() {
  var meepleFloor = randomFloor();
  var targetFloor;
  do {
    targetFloor = randomFloor();
  } while (targetFloor == meepleFloor);
  meeple[meepleFloor].push(targetFloor);
  if (meepleFloor > targetFloor) {
    driver.callGoingDown(meepleFloor);
  } else {
    driver.callGoingUp(meepleFloor);
  }
}

setInterval(newMeepleCall, 4 * 1000);

document.onkeydown = function(e) {
  var newElevator = elevator;
  switch (e.keyCode) {
    case 78:// n
    case 40:// down arrow
      newElevator.driverPower = 2;
      newElevator.autopilot = false;
      break;
    case 80:// p
    case 38:// up arrow
      newElevator.driverPower = -2;
      newElevator.autopilot = false;
      break;
    case 32:// space
      // open door
      newElevator = unload(newElevator);
      [newElevator, meeple] = load(newElevator, meeple);
      break;
    case 222:// '
      // Going Up
      newElevator = unload(newElevator);
      [newElevator, meeple] = load(newElevator, meeple, true);
      break;
    case 191:// /
      // Going Down
      newElevator = unload(newElevator);
      [newElevator, meeple] = load(newElevator, meeple, false);
      break;
    default:
  }
  // Wrtite to world
  elevator = newElevator;
};

document.onkeyup = function() {
  if (Math.abs(elevator.driverPower) > 0) {
    elevator.autopilot = true;
  }
};

// === Public Functions ---

function ringGoingUp() {
  [elevator, meeple] = load(elevator, meeple, true);
}

function ringGoingDown() {
  [elevator, meeple] = load(elevator, meeple, false);
}

function openDoors() {
  elevator = unload(elevator);
}

function goToFloor(floor) {
  console.log('not implemented');
}
