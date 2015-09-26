const driver = {
  callGoingDown: function (atFloor) {
    console.log('callGoingDown not implemented : ' + atFloor);
  },

  // Someone at indicated floor wants to go up
  callGoingUp: function (atFloor) {
    console.log('callGoingUp not implemented : ' + atFloor);
  },

  // Someone inside the elevator requested the indicated floor
  callToFloor: function (floor) {
    console.log('callToFloor not implemented : ' + floor);
  },

  // The elevator has arrived at the indicated floor, and it would be
  // appropriate to open the doors and ring for a direction.
  arrivedAtFloor: function (floor) {
    console.log('arrivedAtFloor not implemented : ' + floor);
  }
};

export {driver}
