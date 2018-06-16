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

	var dataInBuff = "";

	this._client.on('data', function (data) {
		dataInBuff += data;
		if(dataInBuff.slice(-1) != "\n") {
			return;
		}
		if (typeof(self.parseFunc) !== 'undefined') {
			self.parseFunc(dataInBuff);
			dataInBuff = "";
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
    else if (parseFunc) {
        parseFunc('ERR Other communication still running\n');
    }
};

Nut.prototype.close = function () {
	this.send('LOGOUT');
	this._client.end();
};

var vars = [];
function parseKeyValueList(data, list_type, re, callback) {
    if (!data) data = 'ERR Empty response\n';
    var data_array = data.split('\n');
    if (data_array.length === 1) data_array.push('');
	for (i = 0; i < data_array.length-1; i++) {
		line = data_array[i];
		if (line.indexOf('BEGIN LIST ' + list_type) === 0) {
			vars = [];
		}
		else if (line.indexOf(list_type + ' ') === 0) {
			matches = re.exec(line);
			vars[matches[1]] = matches[2];
		}
		else if (line.indexOf('END LIST ' + list_type) === 0) {
			callback(vars, null);
			break;
		}
		else if (line.indexOf('ERR') === 0) {
			callback(null, line.substring(4));
			break;
		}
	}
}

Nut.prototype.GetUPSList = function (callback) {
    self = this;
    this.send('LIST UPS', function(data) {
		parseKeyValueList(data, 'UPS', /^UPS\s+(.+)\s+"(.*)"/, function(vars, err) {
			self.status = 'idle';
			callback(vars, err);
		});
	});
};

Nut.prototype.GetUPSVars = function (ups, callback) {
    self = this;
	this.send('LIST VAR ' + ups, function(data) {
		parseKeyValueList(data, 'VAR', /^VAR\s+.+\s+(.+)\s+"(.*)"/, function(vars, err) {
			self.status = 'idle';
			callback(vars, err);
		});
	});
};

Nut.prototype.GetUPSCommands = function (ups, callback) {
    self = this;
	this.send('LIST CMD ' + ups, function(data) {
        if (!data) data = 'ERR Empty response\n';
		var data_array = data.split('\n');
        if (data_array.length === 1) data_array.push('');
		var re = /^CMD\s+.+\s+(.+)/;
		for (i = 0; i < data_array.length-1; i++) {
			line = data_array[i];
			if (line.indexOf('BEGIN LIST CMD') === 0) {
				commands = [];
			}
			else if (line.indexOf('CMD ' + ups) === 0) {
				matches = re.exec(line);
				commands.push(matches[1]);
			}
			else if (line.indexOf('END LIST CMD') === 0) {
				self.status = 'idle';
				callback(commands, null);
				break;
			}
			else if (line.indexOf('ERR') === 0) {
				self.status = 'idle';
				callback(null, line.substring(4));
				break;
			}
		}
	});
};

Nut.prototype.GetRWVars = function (ups, callback) {
    self = this;
	this.send('LIST RW ' + ups, function(data) {
		parseKeyValueList(data, 'RW', /^RW\s+.+\s+(.+)\s+"(.*)"/, function(vars, err) {
			self.status = 'idle';
			callback(vars, err);
		});
	});
};

Nut.prototype.GetEnumsForVar = function (ups, name, callback) {
    self = this;
	this.send('LIST ENUM ' + ups + ' ' + name, function(data) {
        if (!data) data = 'ERR Empty response\n';
		var data_array = data.split('\n');
        if (data_array.length === 1) data_array.push('');
		var re = /^ENUM\s+.+\s+.+\s+"(.*)"/;
		for (i = 0; i < data_array.length-1; i++) {
			line = data_array[i];
			if (line.indexOf('BEGIN LIST ENUM') === 0) {
				enums = [];
			}
			else if (line.indexOf('ENUM ' + ups + ' ' + name) === 0) {
				matches = re.exec(line);
				enums.push(matches[1]);
			}
			else if (line.indexOf('END LIST ENUM') === 0) {
				self.status = 'idle';
				callback(enums, null);
				break;
			}
			else if (line.indexOf('ERR') === 0) {
				self.status = 'idle';
				callback(null, line.substring(4));
				break;
			}
		}
	});
};

Nut.prototype.GetRangesForVar = function (ups, name, callback) {
    self = this;
	this.send('LIST RANGE ' + ups + ' ' + name, function(data) {
        if (!data) data = 'ERR Empty response\n';
		var data_array = data.split('\n');
        if (data_array.length === 1) data_array.push('');
		var re = /^RANGE\s+.+\s+.+\s+"(.+)"\s+"(.+)"/;
		for (i = 0; i < data_array.length-1; i++) {
			line = data_array[i];
			if (line.indexOf('BEGIN LIST RANGE') === 0) {
				ranges = [];
			}
			else if (line.indexOf('RANGE ' + ups + ' ' + name) === 0) {
				matches = re.exec(line);
				ranges.push({
					'min': matches[1],
					'max': matches[2]
				});
			}
			else if (line.indexOf('END LIST RANGE') === 0) {
				self.status = 'idle';
				callback(ranges, null);
				break;
			}
			else if (line.indexOf('ERR') === 0) {
				self.status = 'idle';
				callback(null, line.substring(4));
				break;
			}
		}
	});
};

Nut.prototype.GetVarType = function (ups, name, callback) {
    self = this;
	this.send('GET TYPE ' + ups + ' ' + name, function(data) {
        if (!data) data = 'ERR Empty response';
		self.status = 'idle';
		var re = /^TYPE\s+.+\s+.+\s+(.+)/;
		matches = re.exec(data);
		if (matches && matches[1]) {
			callback(matches[1], null);
		}
		else if (data.indexOf('ERR') === 0) {
			callback(null, data.substring(4));
		}
		else {
			callback(null, null);
		}
	});
};

Nut.prototype.GetVarDescription = function (ups, name, callback) {
    self = this;
	this.send('GET DESC ' + ups + ' ' + name, function(data) {
        if (!data) data = 'ERR Empty response';
		self.status = 'idle';
		var re = /^DESC\s+.+\s+.+\s+"(.+)"/;
		matches = re.exec(data);
		if (matches && matches[1]) {
			callback(matches[1], null);
		}
		else if (data.indexOf('ERR') === 0) {
			callback(null, data.substring(4));
		}
		else {
			callback(null, null);
		}
	});
};

Nut.prototype.GetCommandDescription = function (ups, command, callback) {
    self = this;
	this.send('GET CMDDESC ' + ups + ' ' + command, function(data) {
        if (!data) data = 'ERR Empty response';
		self.status = 'idle';
		var re = /^CMDDESC\s+.+\s+.+\s+"(.+)"/;
		matches = re.exec(data);
		if (matches && matches[1]) {
			callback(matches[1], null);
		}
		else if (data.indexOf('ERR') === 0) {
			callback(null, data.substring(4));
		}
		else {
			callback(null, null);
		}
	});
};

function parseMinimalResult(data, callback) {
	if (data.indexOf('ERR') === 0) {
		data = data.substring(4);
		if (callback) callback(data);
	}
	if (callback) callback(null);
}

Nut.prototype.SetRWVar = function (ups, name, value, callback) {
    self = this;
	this.send('SET VAR ' + ups + ' ' + name + ' ' + value, function(data) {
		self.status = 'idle';
		parseMinimalResult(data, callback);
	});
};

Nut.prototype.RunUPSCommand = function (ups, command, callback) {
    self = this;
	this.send('INSTCMD ' + ups + ' ' + command, function(data) {
		self.status = 'idle';
		parseMinimalResult(data, callback);
	});
};

Nut.prototype.SetUsername = function (username, callback) {
    self = this;
	this.send('USERNAME ' + username, function(data) {
		self.status = 'idle';
		parseMinimalResult(data, callback);
	});
};

Nut.prototype.SetPassword = function (pwd, callback) {
    self = this;
	this.send('PASSWORD ' + pwd, function(data) {
		self.status = 'idle';
		parseMinimalResult(data, callback);
	});
};

Nut.prototype.Master = function (ups, callback) {
    self = this;
	this.send('MASTER ' + ups, function(data) {
		self.status = 'idle';
		parseMinimalResult(data, callback);
	});
};

Nut.prototype.FSD = function (ups, callback) {
    self = this;
	this.send('FSD ' + ups, function(data) {
        if (!data) data = 'ERR Empty response';
		self.status = 'idle';
		if (data.indexOf('OK FSD-SET') === 0) {
			callback(null);
		}
		else {
			if (data.indexOf('ERR') === 0) {
				data = data.substring(4);
			}
			callback(data);
		}
	});
};

Nut.prototype.help = function (callback) {
    self = this;
	this.send('HELP', function(data) {
		self.status = 'idle';
		callback(data);
	});
};

Nut.prototype.ver = function (callback) {
    self = this;
	this.send('VER', function(data) {
		self.status = 'idle';
		callback(data);
	});
};

Nut.prototype.netVer = function (callback) {
    self = this;
	this.send('NETVER', function(data) {
		self.status = 'idle';
		callback(data);
	});
};

Nut.prototype.ListClients = function (ups) {
    self = this;
	this.send('LIST CLIENT ' + ups, function(data) {
        if (!data) data = 'ERR Empty response\n';
		var data_array = data.split('\n');
        if (data_array.length === 1) data_array.push('');
		var re = /^CLIENT\s+.+\s+(.+)/;
		for (i = 0; i < data_array.length-1; i++) {
			line = data_array[i];
			if (line.indexOf('BEGIN LIST CLIENT') === 0) {
				clients = [];
			}
			else if (line.indexOf('CLIENT ' + ups) === 0) {
				matches = re.exec(line);
				clients.push(matches[1]);
			}
			else if (line.indexOf('END LIST CLIENT') === 0) {
				self.status = 'idle';
				callback(clients, null);
				break;
			}
			else if (line.indexOf('ERR') === 0) {
				self.status = 'idle';
				callback(null, line.substring(4));
				break;
			}
		}
	});
};
