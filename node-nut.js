var net = require('net');
var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

module.exports = Nut;

function Nut (port, host)
{
	EventEmitter.call(this);
	Nut.init.call(this, port, host);
}

inherits(Nut, EventEmitter);

Nut.init = function (port, host) {
	this._port = port;
	this._host = host;
};

Nut.prototype.start = function () {
	var self = this;
	self.status = 'idle';

	function open () { self.emit('ready'); }
	function error (err) { self.emit('error', err); }
	function close () { self.emit('close'); }

	this._client = net.createConnection (self._port, self._host, open);
	this._client.setEncoding('ascii');

	this._client.on('data', function (data) {
		if (typeof(self.parseFunc) !== 'undefined') {
			self.parseFunc(data);
		}
		else {
			self.status = 'idle';
		}
	});

	this._client.on('error', error);
	this._client.on('close', close);
};

Nut.prototype.send = function (cmd, parseFunc) {
	if (this.status == 'idle') {
		this.status = 'waiting';
		this.parseFunc = parseFunc;
		this._client.write(cmd + '\n');
	}
};

Nut.prototype.close = function () {
	this.send('LOGOUT');
};

Nut.prototype.GetUPSList = function (callback) {
	this.send('LIST UPS', function(data) {
		var data_array = data.split('\n');
		var re = /^UPS\s+(.+)\s+"(.+)"/;
		for (i = 0; i < data_array.length-1; i++) {
			line = data_array[i];
			if (line.indexOf('BEGIN LIST UPS') === 0) {
				vars = [];
			}
			else if (line.indexOf('UPS ') === 0) {
				matches = re.exec(line);
				vars[matches[1]] = matches[2];
			}
			else if (line.indexOf('END LIST UPS') === 0) {
				this.status = 'idle';
				callback(vars);
			}
		}
	});
};

Nut.prototype.GetUPSVars = function (ups, callback) {
	this.send('LIST VAR ' + ups, function(data) {
		var data_array = data.split('\n');
		var re = /^VAR\s+.+\s+(.+)\s+"(.+)"/;
		for (i = 0; i < data_array.length-1; i++) {
			line = data_array[i];
			if (line.indexOf('BEGIN LIST VAR') === 0) {
				vars = [];
			}
			else if (line.indexOf('VAR ' + ups) === 0) {
				matches = re.exec(line);
				vars[matches[1]] = matches[2];
			}
			else if (line.indexOf('END LIST VAR') === 0) {
				this.status = 'idle';
				callback(vars);
			}
		}
	});
};

Nut.prototype.GetUPSCommands = function (ups, callback) {
	this.send('LIST CMD ' + ups, function(data) {
		var data_array = data.split('\n');
		var re = /^CMD\s+.+\s+(.+)/;
		for (i = 0; i < data_array.length-1; i++) {
			line = data_array[i];
			if (line.indexOf('BEGIN LIST CMD') === 0) {
				commands = [];
			}
			else if (line.indexOf('CMD ') === 0) {
				matches = re.exec(line);
				commands.push(matches[1]);
			}
			else if (line.indexOf('END LIST CMD') === 0) {
				this.status = 'idle';
				callback(commands);
			}
		}
	});
};

Nut.prototype.GetRWVars = function (ups) {
	this.send('LIST RW ' + ups);
};

Nut.prototype.SetRWVar = function (ups, name, value) {
	this.send('SET VAR ' + ups + ' ' + name + ' ' + value);
};

Nut.prototype.RunUPSCommand = function (ups, command) {
	this.send('INSTCMD ' + ups + ' ' + command);
};

Nut.prototype.FSD = function (ups) {
	this.send('MASTER ' + ups);
};

Nut.prototype.help = function (callback) {
	this.send('HELP', function(data) {
		this.status = 'idle';
		callback(data);
	});
};

Nut.prototype.ver = function (callback) {
	this.send('VER', function(data) {
		this.status = 'idle';
		callback(data);
	});
};

Nut.prototype.ListClients = function (ups) {
	this.send('LIST CLIENTS ' + ups);
};
