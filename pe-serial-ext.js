/*
 *This program is free software: you can redistribute it and/or modify
 *it under the terms of the GNU General Public License as published by
 *the Free Software Foundation, either version 3 of the License, or
 *(at your option) any later version.
 *
 *This program is distributed in the hope that it will be useful,
 *but WITHOUT ANY WARRANTY; without even the implied warranty of
 *MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *GNU General Public License for more details.
 *
 *You should have received a copy of the GNU General Public License
 *along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function(ext) {
    var device = null;
	var potentialDevices = [];
	var poller = null;
    var watchdog = null;

	ext._deviceConnected = function(dev) {
		potentialDevices.push(dev);
		if (!device) {
			tryNextDevice();
		}
	};
	
    function tryNextDevice() {
        // If potentialDevices is empty, device will be undefined.
        // That will get us back here next time a device is connected.
        device = potentialDevices.shift();
        if (!device) return;
		if (device) {
			console.log("Attempt to connect to serial")
			device.open({ stopBits: 0, bitRate: 115200, ctsFlowControl: 0 }, deviceOpened);
		}
	}
	
	function arrayBufferToString(buffer){
		var arr = new Uint8Array(buffer);
		var str = String.fromCharCode.apply(String, arr);
		return str;
	}
	
	function stringToArrayBuffer(str){
		var arr = new Uint8Array(str.length);
		for(var i=str.length; i--; )
			arr[i] = str.charCodeAt(i);
		return arr.buffer;
	}

	function deviceOpened(dev){
        if (!dev) {
			console.log("Failed to open the port")
            // Opening the port failed.
            tryNextDevice();
            return;
        }
        device.set_receive_handler(function(data) {
            console.log('Received: ' + data.byteLength);
			var dataView = new DataView(data);
			console.log(arrayBufferToString(data));
        });
        console.log('Connected');
		console.log(device);
	};
	ext._deviceRemoved = function(dev) {
		if(device != dev) return;
		if(poller) poller = clearInterval(poller);
		device = null;
	};
	
	ext._shutdown = function() {
		if(poller) poller = clearInterval(poller);
		if(device) device.close();
		device = null;
	}	
	  	ext._shutdown = function() {};
  	
    ext._getStatus = function() {
        if(!device) return {status: 1, msg: 'Board disconnected'};
        if(watchdog) return {status: 1, msg: 'Waiting for board to be connected'};
        return {status: 2, msg: 'PicoBoard connected'};
    }
  	ext.sayThis = function(txt) {
		device.send(stringToArrayBuffer("=send_command(\"" + txt + "\")\r\n"));
  	};
	ext.walk = function() {
		device.send(stringToArrayBuffer("=send_command(\"Dont myndifydoo.<MO=EL,1.0,0.5><MO=HN,0,0.5><PM><MO=EL,0.1,0.5><MO=HN,0.3,0.5><PA><WK=W2><PA>\")\r\n"));
	}; 	
	ext.crazy = function() {
		device.send(stringToArrayBuffer("crazy = \"You asked for it.<PA=2><MO=EL,1,0.5><PA=1.5><MO=HT,0,0.1><PA=0.8><MO=HT,1,0.2><PA=0.5><MO=HT,0.5,0.2> \"\r\n"));
		device.send(stringToArrayBuffer("crazy = crazy .. \"<PM><MO=CH,0,0.1><MO=EB,1,0.1><PM><MO=CH,1,0.1><MO=EB,0,0.1><PM><MO=CH,0,0.1><MO=EB,1,0.1><PM><MO=CH,1,0.1><MO=EB,0,0.1> \"\r\n"));
		//device.send(stringToArrayBuffer("crazy = crazy .. \"<PM><MO=AR,1,0.5><PM><MO=AR,0,0.5><PM><MO=HN,1,0.2><PM><MO=HN,0,0.2><PM><MO=HN,1,0.2><PM><MO=HN,0,0.2><PM><MO=HN,1,0.2> \"\r\n"));
		//device.send(stringToArrayBuffer("crazy = crazy .. \"<MO=AR,1,0.5><PM><MO=AR,0,0.5><PM><MO=HT,0.7,0.2><PM><MO=HT,0.3,0.2><PM><MO=HT,0.7,0.2><PM><MO=HT,0.3,0.2><PM><MO=HT,0.7,0.2> \"\r\n"));
		//device.send(stringToArrayBuffer("crazy = crazy .. \"<PM><MO=HT,0.5,0.2><MO=AR,1,0.5><PM><MO=AR,0,0.5><PM><MO=CH,0,0.1><MO=EB,1,0.1><PM><MO=CH,1,0.1><MO=EB,0,0.1><PM> \"\r\n"));
		//device.send(stringToArrayBuffer("crazy = crazy .. \"<MO=CH,0,0.1><MO=EB,1,0.1><PM><MO=CH,1,0.1><MO=EB,0,0.1><PM><MO=CH,0,0.1><MO=EB,1,0.1><PM><PM><MO=CH,1,0.1><MO=EB,0,0.1> \"\r\n"));
		//device.send(stringToArrayBuffer("crazy = crazy .. \"<PM><MO=CH,0,0.1><MO=EB,1,0.1><PM><MO=CH,1,0.1><MO=EB,0,0.1><PM><MO=CH,0,0.1><MO=EB,1,0.1><PM><MO=CH,1,0.1><MO=EB,0,0.1> \"\r\n"));
		//device.send(stringToArrayBuffer("crazy = crazy .. \"<PM><MO=CH,0,0.1><MO=EB,1,0.1><PM><MO=CH,0,0.1><MO=EB,1,0.1><PM><MO=CH,1,0.1><MO=EB,0,0.1><PM><MO=CH,0,0.1><MO=EB,1,0.1> \"\r\n"));
		//device.send(stringToArrayBuffer("crazy = crazy .. \"<PM><MO=CH,1,0.1><MO=EB,0,0.1><PM><MO=HT,0,0.1><PA=0.4><MO=HN,1,0.2><MO=HT,1,0.2><PA=0.7><MO=HT,0.5,0.1><MO=CH,0,0.1> \"\r\n"));
		//device.send(stringToArrayBuffer("crazy = crazy .. \"<MO=EB,1,0.1><PM><MO=AR,1,0.1><MO=MO,1.0,0.3><PA=0.5><MO=AR,0,2><MO=CH,0.5,2><MO=MO,0,2><MO=EB,0,2><MO=HN,0.3,2><PA=1> \"\r\n"));
		//device.send(stringToArrayBuffer("crazy = crazy .. \"<MO=EL,0.1,0.5><PA=1.5> That's gonna hurt in the morning.<MO=EL,1.0,0.5><MO=HT,0.7,0.5><PM><MO=HT,0.3,0.5><PM> \"\r\n"));
		//device.send(stringToArrayBuffer("crazy = crazy .. \"<MO=HT,0.5,0.5><MO=EL,0.1,0.5><PA>\"\r\n"));
		device.send(stringToArrayBuffer("=send_command(crazy)\r\n"));
	};
	ext.wifiSetup = function(ssid, pwd) {
		device.send(stringToArrayBuffer("=init_wifi(\"" + ssid + "\",\""+pwd+"\")\r\n"));
  	};

	var descriptor = {
    	blocks: [
			[' ', 'Say %s', 'sayThis', 'txt', 'hello'],
			[' ', 'Walk', 'walk'],
			[' ', 'Go Crazy', 'crazy'],
			[' ', 'connect','connect'],
			[' ', 'Einstein SSID  %s passwrod %s' , 'wifiSetup', 'ssid', 'EINSTEIN0000','pwd', 'genius0000']
    	],
    
	};

	ScratchExtensions.register('pe-serial-ext', descriptor, ext, {type:'serial'});

})({});
