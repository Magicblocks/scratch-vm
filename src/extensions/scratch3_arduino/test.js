const wsServer = require('./wsServer'); // or './wsServer'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function start() {
	console.log('Searching Arduino...');
	// Find the Arduino com port
	wsServer.findCom();	
	// Wait a little time
	sleep(5000);
	
	wsServer.begin();
	
}
	

start();
