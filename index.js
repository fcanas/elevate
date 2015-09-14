var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var bounds = {width: canvas.width, height: canvas.height};

var floors = 20;

var elevatorSize = bounds.height / floors;

// [floor][person] -> target floor
var meeple = [[4,5,2], [], [9,1], [], [12, 9, 3, 1],
              [], [], [], [], [2,3,1,1],
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
    }
  }

  if ((out.y < (canvas.height - elevatorSize) && out.driverPower > 0) ||
      (out.y > 0 && out.driverPower < 0)) {
    out.y += out.driverPower;
  }
  out.lastDirection = out.driverPower / Math.abs(out.driverPower);
  return out;
}

function paintElevator(e) {
  // car
  ctx.fillStyle = 'black';
  ctx.fillRect(e.x, e.y, elevatorSize, elevatorSize);
}

function splitMeeple(meepleAtFloor, floor) {
  return meepleAtFloor.reduce(function(u, v) {
    // console.log(u);
    if (v < floor) {
      u[0].push(v);
    } else {
      u[1].push(v);
    }
    return u;
  }, [new Array(), new Array()]);
}

function paintMeeple(mps) {
  for (var floor = 0; floor < mps.length; ++floor) {
    var meepleAtFloor = mps[floor];
    [goingDown, goingUp] = splitMeeple(meepleAtFloor, floor);
    ctx.beginPath();
    ctx.fillStyle = 'red';
    for (var m = 0; m < goingDown.length; ++m) {
      ctx.arc(elevator.x + elevatorSize + 20 + 15 * m,
              (bounds.height / floors) * (0.5 + floors - (floor + 1)),
              5, 0, 2 * Math.PI, false);
      ctx.closePath();
    }
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'green';
    for (var m = 0; m < goingUp.length; ++m) {
      ctx.arc(elevator.x - 20 - 15 * m,
              (bounds.height / floors) * (0.5 + floors - (floor + 1)),
              5, 0, 2 * Math.PI, false);
      ctx.closePath();
    }
    ctx.fill();
  }
}

function paintCallFloors(elevator) {
  ctx.fillStyle = 'rgba(254, 165, 40, 0.3)';
  var floorHeight = bounds.height / floors;
  for (var index = 0; index < elevator.meeple.length; ++index) {
    var floor = elevator.meeple[index];
    var floorY = bounds.height - (floor + 1) * floorHeight;
    ctx.fillRect(0, floorY, bounds.width, floorHeight);
  }
}

function paintBuilding(elevator) {
  // track
  ctx.fillStyle = 'darkgray';
  ctx.fillRect(elevator.x, 0, elevatorSize, bounds.height);
  // floors
  ctx.font = '16pt sans-serif';
  var floorHeight = bounds.height / floors;
  ctx.textAlign = 'center';
  for (var f = floors; f > 0; --f) {
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(0, f * floorHeight, bounds.width, 2);
    ctx.fillStyle = 'white';
    ctx.fillText('' + floors - f,
      elevator.x + elevatorSize / 2, f * floorHeight - floorHeight / 2 + 5);
  }
}

function paint() {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  paintBuilding(elevator);
  paintCallFloors(elevator);
  paintElevator(elevator);
  paintMeeple(meeple);
}

setInterval(function() {
  elevator = tick(elevator);
  paint();
}, (1 / 60) * 1000);

function randomFloor() {
  return Math.floor(Math.random() * floors);
}

setInterval(function() {
  var meepleFloor = randomFloor();
  meeple[meepleFloor].push(randomFloor());
}, 6 * 1000);

document.onkeydown = function(e) {
  var newElevator = elevator;
  newElevator.autopilot = false;
  switch (e.keyCode) {
    case 78:// n
    case 40:// down arrow
      newElevator.driverPower = 2;
      break;
    case 80:// p
    case 38:// up arrow
      newElevator.driverPower = -2;
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
  elevator.autopilot = true;
};
