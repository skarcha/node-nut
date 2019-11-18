# Node-NUT

Node-NUT is a NodeJS module that implements a NUT (Network UPS Tools) client.

## Version compatibility information

v2 introduces new method names and Promises for certain functions. Please refer to the API below.

## API
<a name="Nut"></a>

### Nut
**Kind**: global class  

* [Nut](#Nut)
    * [new Nut([port], [host])](#new_Nut_new)
    * [.connected](#Nut+connected) : <code>boolean</code>
    * [.connect()](#Nut+connect) ⇒ <code>Promise</code>
    * [.disconnect()](#Nut+disconnect)
    * [.getUpsList([callback])](#Nut+getUpsList) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getUpsVars(ups, [callback])](#Nut+getUpsVars) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getUpsCommands(ups, [callback])](#Nut+getUpsCommands) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getRwVars(ups, [callback])](#Nut+getRwVars) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getEnumsForVar(ups, name, [callback])](#Nut+getEnumsForVar) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getRangesForVar(ups, name, [callback])](#Nut+getRangesForVar) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getVarType(ups, name, [callback])](#Nut+getVarType) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getVarDescription(ups, name, [callback])](#Nut+getVarDescription) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getCommandDescription(ups, command, [callback])](#Nut+getCommandDescription) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.nutSetRwVar(ups, name, value, [callback])](#Nut+nutSetRwVar) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.runUpsCommand(ups, command, [callback])](#Nut+runUpsCommand) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.setUsername(username, [callback])](#Nut+setUsername) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.setPassword(password, [callback])](#Nut+setPassword) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.master(ups, [callback])](#Nut+master) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.fsd(ups, [callback])](#Nut+fsd) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.help([callback])](#Nut+help) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.ver([callback])](#Nut+ver) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.netVer([callback])](#Nut+netVer) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.listClients(ups, [callback])](#Nut+listClients) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="new_Nut_new"></a>

#### new Nut([port], [host])
Create an instance of Nut to use with the provided upsd instance at host:port


| Param | Type |
| --- | --- |
| [port] | <code>number</code> | 
| [host] | <code>string</code> | 

<a name="Nut+connected"></a>

#### nut.connected : <code>boolean</code>
Gets current connection state

**Kind**: instance property of [<code>Nut</code>](#Nut)  
<a name="Nut+connect"></a>

#### nut.connect() ⇒ <code>Promise</code>
Connect to upsd instance.

**Kind**: instance method of [<code>Nut</code>](#Nut)  
**Returns**: <code>Promise</code> - Connection established.  
<a name="Nut+disconnect"></a>

#### nut.disconnect()
Use to disconnect manually inbetween polling cycles when polling with very low frequencies. For e.g. `upslog` disconnects [if the polling cycle is >30s](https://github.com/networkupstools/nut/blob/d56ac7712fa6c3920460a08c649ad03d2c2e82e7/clients/upslog.c#L526).

**Kind**: instance method of [<code>Nut</code>](#Nut)  
<a name="Nut+getUpsList"></a>

#### nut.getUpsList([callback]) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: instance method of [<code>Nut</code>](#Nut)  
**Returns**: <code>Promise.&lt;object&gt;</code> - Object containing key-value pairs of upsId -> description.  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+getUpsVars"></a>

#### nut.getUpsVars(ups, [callback]) ⇒ <code>Promise.&lt;object&gt;</code>
Get variables for a certain UPS.

**Kind**: instance method of [<code>Nut</code>](#Nut)  
**Returns**: <code>Promise.&lt;object&gt;</code> - Object containing key-value list of availabla variables. For e.g. `battery.charge`.  

| Param | Type | Description |
| --- | --- | --- |
| ups | <code>string</code> | UPS identifier |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+getUpsCommands"></a>

#### nut.getUpsCommands(ups, [callback]) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: instance method of [<code>Nut</code>](#Nut)  

| Param | Type | Description |
| --- | --- | --- |
| ups | <code>string</code> | UPS identifier |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+getRwVars"></a>

#### nut.getRwVars(ups, [callback]) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: instance method of [<code>Nut</code>](#Nut)  

| Param | Type | Description |
| --- | --- | --- |
| ups | <code>string</code> | UPS identifier |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+getEnumsForVar"></a>

#### nut.getEnumsForVar(ups, name, [callback]) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: instance method of [<code>Nut</code>](#Nut)  

| Param | Type | Description |
| --- | --- | --- |
| ups | <code>string</code> | UPS identifier |
| name | <code>string</code> | Variable name |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+getRangesForVar"></a>

#### nut.getRangesForVar(ups, name, [callback]) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: instance method of [<code>Nut</code>](#Nut)  

| Param | Type | Description |
| --- | --- | --- |
| ups | <code>string</code> | UPS identifier |
| name | <code>string</code> | Variable name |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+getVarType"></a>

#### nut.getVarType(ups, name, [callback]) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: instance method of [<code>Nut</code>](#Nut)  

| Param | Type | Description |
| --- | --- | --- |
| ups | <code>string</code> | UPS identifier |
| name | <code>string</code> | Variable name |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+getVarDescription"></a>

#### nut.getVarDescription(ups, name, [callback]) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: instance method of [<code>Nut</code>](#Nut)  

| Param | Type | Description |
| --- | --- | --- |
| ups | <code>string</code> | UPS identifier |
| name | <code>string</code> | Variable name |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+getCommandDescription"></a>

#### nut.getCommandDescription(ups, command, [callback]) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: instance method of [<code>Nut</code>](#Nut)  

| Param | Type | Description |
| --- | --- | --- |
| ups | <code>string</code> | UPS identifier |
| command | <code>string</code> | Command name |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+nutSetRwVar"></a>

#### nut.nutSetRwVar(ups, name, value, [callback]) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: instance method of [<code>Nut</code>](#Nut)  

| Param | Type | Description |
| --- | --- | --- |
| ups | <code>string</code> | UPS identifier |
| name | <code>string</code> | Variable name |
| value | <code>string</code> | Value to set |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+runUpsCommand"></a>

#### nut.runUpsCommand(ups, command, [callback]) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: instance method of [<code>Nut</code>](#Nut)  

| Param | Type | Description |
| --- | --- | --- |
| ups | <code>string</code> | UPS identifier |
| command | <code>string</code> | Command name |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+setUsername"></a>

#### nut.setUsername(username, [callback]) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: instance method of [<code>Nut</code>](#Nut)  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | Login with provided username |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+setPassword"></a>

#### nut.setPassword(password, [callback]) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: instance method of [<code>Nut</code>](#Nut)  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | Login with provided password |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+master"></a>

#### nut.master(ups, [callback]) ⇒ <code>Promise.&lt;object&gt;</code>
Gain master privileges for this connection. You have to login with a username/password combination first.

**Kind**: instance method of [<code>Nut</code>](#Nut)  

| Param | Type | Description |
| --- | --- | --- |
| ups | <code>string</code> | UPS identifier |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+fsd"></a>

#### nut.fsd(ups, [callback]) ⇒ <code>Promise.&lt;object&gt;</code>
Execute FSD (you must be master to do this)

**Kind**: instance method of [<code>Nut</code>](#Nut)  

| Param | Type | Description |
| --- | --- | --- |
| ups | <code>string</code> | UPS identifier |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+help"></a>

#### nut.help([callback]) ⇒ <code>Promise.&lt;object&gt;</code>
Send `HELP` command.

**Kind**: instance method of [<code>Nut</code>](#Nut)  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+ver"></a>

#### nut.ver([callback]) ⇒ <code>Promise.&lt;object&gt;</code>
Send `VER` command.

**Kind**: instance method of [<code>Nut</code>](#Nut)  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+netVer"></a>

#### nut.netVer([callback]) ⇒ <code>Promise.&lt;object&gt;</code>
Send `NETVER` command.

**Kind**: instance method of [<code>Nut</code>](#Nut)  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |

<a name="Nut+listClients"></a>

#### nut.listClients(ups, [callback]) ⇒ <code>Promise.&lt;object&gt;</code>
**Kind**: instance method of [<code>Nut</code>](#Nut)  

| Param | Type | Description |
| --- | --- | --- |
| ups | <code>string</code> | UPS identifier |
| [callback] | <code>function</code> | Provide either a callback function or use the returned promise |


## Links

Protocol: http://networkupstools.org/docs/developer-guide.chunked/ar01s09.html
