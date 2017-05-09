# Node-NUT

Node-NUT is a NodeJS module that implements a NUT (Network UPS Tools) client.

## Version compatibility information
v1.0.0 introduce callbacks into all functions including a second "error" parameter. This error parameter is null on success or a text on error. Please see the updated method documentation below.

This change should not break existing code because you can simply ignore the second parameter, but there is one change coming with it:

When with v0.0.x an error occured in one of the "Get-List-Of" methods then the callback was pot. never called at all. This has changed now because now the callback is also called in errorcases, but then with an empty object/list in return. So you may want to include error handling code that not strange things happens in error cases.

## Events

### ready

This event is emitted when the connection to the NUT server is established.

### error

Emitted when there was an error establishing the connection or with the network communication to
the server.

### close

Emitted when the connection to the NUT server is closed.

## Functions (tested)

### `start()`

Starts the connection to the server.

### `GetUPSList (callback)`

Calls the `callback` function with the list of UPS as an object as the first parameter. If the second parameter is not null then an error happened and the first object is returned as null.
Keys in the object are the UPS names and the values are the provided description for this UPS.

### `GetUPSVars (upsname, callback)`

Calls the `callback` function with the list of VARs of `upsname` as an object as the first parameter.  If the second parameter is not null then an error happened and the first object is returned as null.
Keys in the object are the VAR names and the values are the current VAR values.

### `GetUPSCommands (upsname, callback)`

Calls the `callback` function with the list of COMMANDs available in `upsname` as an array as the first parameter. If the second parameter is not null then an error happened and the first object is returned as null.
The values in the array are the available COMMANDs.

### `GetCommandDescription (upsname, cmdname, callback)`

Calls the `callback` function with the description for the given `cmdname` as a string as the first parameter. If the second parameter is not null then an error happened and the first object is returned as null.
The description is returned as string.

### `RunUPSCommand (upsname, command, callback)`

Rund the COMMAND given by `command`. The callback is called with one parameter `err` which is null on success or contains an error string on error and can be used to check the result of the call.

***Note: Some commands need to set Username and Password before, else it returns an Error! Please consult the documentation of your UPS system.***

### `SetUsername (username, callback)`

Set the password for the connection. The callback is called with one parameter `err` which is null on success or contains an error string on error and can be used to check the result of the call.

***Note: Incorrect values may not generate an error when setting the username, but when executing the command later on!***

### `SetPassword (password, callback)`

Set the password for the connection. The callback is called with one parameter `err` which is null on success or contains an error string on error and can be used to check the result of the call.

***Note: Incorrect values may not generate an error when setting the password, but when executing the command later on!***

### `GetRWVars (upsname, callback)`

Calls the `callback` function with the list of RW-VARs of `upsname` as an object as the first parameter.  If the second parameter is not null then an error happened and the first object is returned as null.
Keys in the object are the RW-VAR names and the values are the current RW-VAR values.

### `SetRWVar (upsname, varname, value, callback)`

Set the value of the RW-VAR given by `varname`. The callback is called with one parameter `err` which is null on success or contains an error string on error and can be used to check the result of the call.

### `GetVarType (upsname, varname, callback)`

Calls the `callback` function with the type for the given `varname` as a string as the first parameter. If the second parameter is not null then an error happened and the first object is returned as null.

The following types are defined, and multiple words may be returned:
* RW: this variable may be set to another value with SET
* ENUM: an enumerated type, which supports a few specific values
* STRING:n: this is a string of maximum length n
* RANGE: this is an numeric, either integer or float, comprised in the range (see LIST RANGE)
* NUMBER: this is a simple numeric value, either integer or float :

For more details see http://networkupstools.org/docs/developer-guide.chunked/ar01s09.html#_type

### `GetVarDescription (upsname, varname, callback)`

Calls the `callback` function with the description for the given `varname` as a string as the first parameter. If the second parameter is not null then an error happened and the first object is returned as null.
The description is returned as string.

### `GetEnumsForVar (upsname, varname, callback)`

Calls the `callback` function with the list of allowed ENUM values for the given `varname` as an array as the first parameter. If the second parameter is not null then an error happened and the first object is returned as null.
The values in the array are the available ENUMs.

### `GetRangesForVar (upsname, varname, callback)`

Calls the `callback` function with the list of allowed RANGEs for the values for the given `varname` as an array as the first parameter. If the second parameter is not null then an error happened and the first object is returned as null.
The values in the array are objects with the keys `min` and `max` for the various ranges.

### `Master (upsname, callback)`

Send the MASTER command to the given `upsname`. The callback is called with one parameter `err` which is null on success or contains an error string on error and can be used to check the result of the call.

### `FSD (upsname, callback)`

Send the FSD command to the given `upsname`. The callback is called with one parameter `err` which is null on success or contains an error string on error and can be used to check the result of the call.

### `ListClients (upsname)`

### `help(callback)`

Call the `callback` function with the result of the command `help` as a string.

### `ver (callback)`

Call the `callback` function with the version of the server as a string.

### `netVer (callback)`

Call the `callback` function with the version of the network protocol as a string.


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
	this.GetUPSList(function(upslist, err) {
        if (err) console.log('Error: ' + err)
        console.log(upslist);
		self.close();
	});
});

oNut.start();
```

## Links

Protocol: http://networkupstools.org/docs/developer-guide.chunked/ar01s09.html
