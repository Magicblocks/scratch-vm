const SerialPort = require('serialport');

const Ready = require('@serialport/parser-ready')
const Delimiter = require('@serialport/parser-delimiter')

var com_port = 'comX';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


class wsServer {
	// List all serial ports and try to connect, if Arduino, save COM path.
	static findCom(){
		// For each com ports, open a test connection. 
		SerialPort.list(function (err, com_ports) {
			com_ports.forEach(function(port) {
				
				let TestSerial = new SerialPort(port.comName, { baudRate: 250000});
				const raedyparser = TestSerial.pipe(new Ready({ delimiter: 'ArduinoScratch' }));
				
				//If we have a "ArduinoScratch" message as reply we have finded the right com port, save it and continue.
				raedyparser.on('ready', function() {
					console.log('Arduino found at ', TestSerial.path);
					com_port = TestSerial.path;					
				});
				
				TestSerial.on('open', function () {
					console.log('try serial port', port.comName);
					
					TestSerial.on('data', function(data) {
						console.log('Data received: ' + data);
					});
					
					// After a while, close the com port
					setTimeout(function(){ 
						TestSerial.close(function () {
							console.log('Port closed');
						});	 
					}, 2000);
				});
			});
		});		
	}
	
	

	static begin(){			
		var WebSocketServer = require('ws').Server; 					// include the webSocket library
		var SERVER_PORT = 8081;											// port number for the webSocket server
		var wss = new WebSocketServer({port: SERVER_PORT});				// the webSocket server
		var connections = new Array;									// list of connections to the server
		wss.binaryType = 'arraybuffer';
		var myPort = new SerialPort(com_port, { autoOpen: false, baudRate: 250000 });

		myPort.open(function () {		
			console.log('Arduino port ' + com_port + ' open.\nData rate: ' + myPort.baudRate);
			
			// Using two char delimiter to process each message correctly
			const parser = myPort.pipe(new Delimiter({ delimiter: '\t\n' }))
			
			myPort.on('close', showPortClose);						// called when the serial port closes
			myPort.on('error', showError);							// called when there's an error with the serial port
			parser.on('data', readSerialData);						// called when there's new data incoming		
		});	 
		

		// ------------------------ Serial event functions:
		function showPortClose() {
			console.log('Serial port closed.');
		}
		function showError(error) {
			console.log('Serial port error: ' + error);
		}

		// This is called when new data comes into the serial port:
		function readSerialData(data) {
			//console.log(data);
			if (connections.length > 0) {
				broadcast(data);
			}
		}

		async function sendToSerial(data) {
			var serialMsg = new Uint8Array(10);
			serialMsg = data.split(',');
			console.log("Sending to serial: " + serialMsg);
			myPort.write(serialMsg);
			await sleep(10);
			myPort.write(serialMsg);
		}

		// ------------------------ webSocket Server event functions
		wss.on('connection', handleConnection);

		function handleConnection(client) {
			console.log('New websocket Connection');		// you have a new client
			connections.push(client);						// add this client to the connections array
			client.on('message', sendToSerial);				// when a client sends a message,
			client.on('close', function() {					// when a client closes its connection
				console.log('Connection closed');			// print it out
				var position = connections.indexOf(client);	// get the client's position in the array
				connections.splice(position, 1);			// and delete it from the array
			});
		}
		// This function broadcasts messages to all webSocket clients
		function broadcast(data) {
			for (c in connections) {						// iterate over the array of connections
				connections[c].send(JSON.stringify(data));	// send the data to each connection
			}
		}		
	}
	
}


module.exports = wsServer;

//	start();
