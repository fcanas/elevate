var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var bounds = {width: canvas.width, height: canvas.height};

var floors = 15;

var elevatorSize = bounds.height / floors;

var driverPower = 0;

// [floor][person] -> target floor
var meeple = [[4,5,2], [], [9,1], [], [12, 9, 3, 1], [], [], [], [], [2,3,1,1]]

elevator = {
  x: 100,
  y: 100
}

function tick(e) {
  var out = e;
  if ((out.y < (canvas.height - elevatorSize) && driverPower > 0) || (out.y > 0 && driverPower < 0)) {
    out.y += driverPower;
  }
  return out;
}

function paintElevator(e) {
  // track
  ctx.fillStyle = 'lightgray';
  ctx.fillRect(e.x + Math.floor(elevatorSize/2), 0, 2, bounds.height);
  // car
  ctx.fillStyle = 'black';
  ctx.fillRect(e.x, e.y, elevatorSize, elevatorSize);
}

function paintMeeple(mps) {
  ctx.fillStyle = 'red';
  ctx.beginPath();
  for (var f = 0; f < mps.length; ++f) {
    var mm = mps[f];
    for (var m = 0; m < mm.length; ++m) {
      ctx.arc(elevator.x + elevatorSize + 20 + 15 * m, (bounds.height / floors) * (0.5 + floors - (f + 1)), 5, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.fill();
    }
  }
}

function paintBuilding() {
  // floors
  ctx.fillStyle = 'lightgray';
  var floorHeight = bounds.height / floors;
  for (var f = floors; f > 0; --f) {
    ctx.fillRect(0, f * floorHeight, bounds.width, 2);
  }
}

function paint() {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  paintBuilding();
  paintElevator(elevator);
  paintMeeple(meeple);
}

setInterval(function (){
  elevator = tick(elevator);
  paint();
}, 1/60);

document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 78:// n
    case 40:// down arrow
      driverPower = 2;
      break;
    case 80:// p
    case 38:// up arrow
      driverPower = -2;
      break;
    case 32:// space
      // open door
      break;
    default:
  }
}

document.onkeyup = function() {
  driverPower = 0;
}
