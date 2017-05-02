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
    this._client.end();
};

function parseKeyValueList(data, list_type, re, callback) {
    var data_array = data.split('\n');
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
            callback(vars);
        }
    }
}

Nut.prototype.GetUPSList = function (callback) {
	this.send('LIST UPS', function(data) {
        parseKeyValueList(data, 'UPS', /^UPS\s+(.+)\s+"(.+)"/, function(vars) {
            this.status = 'idle';
            callback(vars);
        });
	});
};

Nut.prototype.GetUPSVars = function (ups, callback) {
	this.send('LIST VAR ' + ups, function(data) {
        parseKeyValueList(data, 'VAR', /^VAR\s+.+\s+(.+)\s+"(.+)"/, function(vars) {
            this.status = 'idle';
            callback(vars);
        });
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
			else if (line.indexOf('CMD ' + ups) === 0) {
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

Nut.prototype.GetRWVars = function (ups, callback) {
	this.send('LIST RW ' + ups, function(data) {
        parseKeyValueList(data, 'RW', /^RW\s+.+\s+(.+)\s+"(.+)"/, function(vars) {
            this.status = 'idle';
            callback(vars);
        });
	});
};

Nut.prototype.GetEnumsForVar = function (ups, name, callback) {
	this.send('LIST ENUM ' + ups + ' ' + name, function(data) {
		var data_array = data.split('\n');
		var re = /^ENUM\s+.+\s+.+\s+"(.+)"/;
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
				this.status = 'idle';
				callback(enums);
			}
		}
	});
};

Nut.prototype.GetRangesForVar = function (ups, name, callback) {
	this.send('LIST RANGE ' + ups + ' ' + name, function(data) {
		var data_array = data.split('\n');
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
				this.status = 'idle';
				callback(ranges);
			}
		}
	});
};

Nut.prototype.GetVarType = function (ups, name, callback) {
	this.send('GET TYPE ' + ups + ' ' + name, function(data) {
        this.status = 'idle';
        var re = /^TYPE\s+.+\s+.+\s+(.+)/;
        matches = re.exec(data);
        if (matches && matches[1]) callback(matches[1]);
          else callback(null);
    });
};

Nut.prototype.GetVarDescription = function (ups, name, callback) {
	this.send('GET DESC ' + ups + ' ' + name, function(data) {
        this.status = 'idle';
        var re = /^DESC\s+.+\s+.+\s+"(.+)"/;
        matches = re.exec(data);
        if (matches && matches[1]) callback(matches[1]);
          else callback(null);
    });
};

Nut.prototype.GetCommandDescription = function (ups, command, callback) {
	this.send('GET CMDDESC ' + ups + ' ' + command, function(data) {
        this.status = 'idle';
        var re = /^CMDDESC\s+.+\s+.+\s+"(.+)"/;
        matches = re.exec(data);
        if (matches && matches[1]) callback(matches[1]);
          else callback(null);
    });
};

function parseMinimalResult(data, callback) {
    this.status = 'idle';
    if (data.indexOf('ERR') === 0) {
        data = data.substring(4);
        if (callback) callback(data);
    }
    if (callback) callback(null);
}

Nut.prototype.SetRWVar = function (ups, name, value, callback) {
	this.send('SET VAR ' + ups + ' ' + name + ' ' + value, function(data) {
        parseMinimalResult(data, callback);
    });
};

Nut.prototype.RunUPSCommand = function (ups, command, callback) {
	this.send('INSTCMD ' + ups + ' ' + command, function(data) {
        parseMinimalResult(data, callback);
    });
};

Nut.prototype.Master = function (ups, callback) {
	this.send('MASTER ' + ups, function(data) {
        parseMinimalResult(data, callback);
    });
};

Nut.prototype.FSD = function (ups, callback) {
	this.send('FSD ' + ups, function(data) {
        this.status = 'idle';
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

Nut.prototype.netVer = function (callback) {
	this.send('NETVER', function(data) {
		this.status = 'idle';
		callback(data);
	});
};

Nut.prototype.ListClients = function (ups) {
	this.send('LIST CLIENT ' + ups, function(data) {
		var data_array = data.split('\n');
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
				this.status = 'idle';
				callback(clients);
			}
		}
	});
};
