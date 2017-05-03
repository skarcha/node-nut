# Node-NUT

Node-NUT is a NodeJS module that implements a NUT (Network UPS Tools) client.

## Events

### ready

This event is emitted when the connection to the NUT server is established.

### error

Emitted when there was an error establishing the connection or with the communication to
the server.

### close

Emitted when the connection to the NUT server is closed.

## Functions (tested)

### `start()`

Starts the connection to the server.

### `GetUPSList (callback)`

Calls the `callback` function with the list of UPS as an array as the first parameter.

### `GetUPSVars (upsname, callback)`

Calls the `callback` function with the list of VARs of `upsname`.

### `GetUPSCommands (upsname, callback)`

Calls the `callback` function with the list of COMMANDs available in `upsname`.

### `help(callback)`

Call the `callback` function with `help` as a string.

### `ver (callback)`

Call the `callback` function with the version of the server as a string.

## Functions (not fully tested)

### `GetRWVars (upsname)`

### `SetRWVar (upsname, varname, value)`

### `RunUPSCommand (upsname, command)`

### `FSD (upsname`

### `ListClients (upsname)`

## Example

```javascript
var Nut = require('node-nut');

oNut = new Nut(3493, 'localhost');

oNut.on('error', function(err) {
	console.log('There was an error: ' + err);
});

oNut.on('close', function() {
	console.log('Connection closed.');
});

oNut.on('ready', function() {
	self = this;
	this.GetUPSList(function(upslist) {
		console.log(upslist);
		self.close();
	});
});

oNut.start();
```

## Links

Protocol: http://networkupstools.org/docs/developer-guide.chunked/ar01s09.html
