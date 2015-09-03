var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var bounds = {width: canvas.width, height: canvas.height};

var floors = 15;

var elevatorSize = bounds.height / floors;

var elevator = {
  x: 100,
  y: 100
}

function driveUp(elevator) {
  var out = elevator;
  if (elevator.y > 0) {
    out.y -= 1;
  }
  return out;
}

function driveDown(elevator) {
  var out = elevator;
  if (elevator.y < (canvas.height - elevatorSize)) {
    out.y += 1;
  }
  return out;
}

function paintElevator(e) {
  // floors
  ctx.fillStyle = 'lightgray';
  var floorHeight = bounds.height / floors;
  for (var f = floors; f > 0; --f) {
    ctx.fillRect(0, f * floorHeight, bounds.width, 2);
  }
  // track
  ctx.fillStyle = 'lightgray';
  ctx.fillRect(e.x + Math.floor(elevatorSize/2), 0, 2, bounds.height);
  // car
  ctx.fillStyle = 'black';
  ctx.fillRect(e.x, e.y, elevatorSize, elevatorSize);
}

paintElevator(elevator);
