// API Listing
//
// Go to the indicated floor
// function goToFloor(floor)
//
// Opens the elevator doors, unloading all current passengers.
// function openDoors()
//
// Loads all the people at the current floor wishing to go UP
// function ringGoingUp()
//
// Loads all the people at the current floor wishing to go DOWN
// function ringGoingDown()

driver = {
  // Someone at indicated floor wants to go down
  callGoingDown: function(atFloor) {
    console.log('callGoingDown not implemented : ' + atFloor);
  },

  // Someone at indicated floor wants to go up
  callGoingUp: function(atFloor) {
    console.log('callGoingUp not implemented : ' + atFloor);
  },

  // Someone inside the elevator requested the indicated floor
  callToFloor: function(floor) {
    console.log('callToFloor not implemented : ' + floor);
  },

  // The elevator has arrived at the indicated floor, and it would be
  // appropriate to open the doors and ring for a direction.
  arrivedAtFloor: function(floor) {
    openDoors();
    console.log('arrivedAtFloor not implemented : ' + floor);
  }
};
