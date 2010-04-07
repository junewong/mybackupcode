/**
 * This file include all control class for the project.
 * It can show an exchange the pictures on the right time you want.  
 *
 * @author junewong
 * @date 2010-04-03
 */

/**
 * GData, it can load the data from remote txt file. 
 * 
 * @access public
 * @return void
 */
function GData()
{
	this._result = '';
	this._xhr = '';
};
GData.prototype = 
{
	getAjaxReuqest : function()
	{
		if (typeof(XMLHttpRequest) == "undefined") 
		{
			XMLHttpRequest = function() {
				try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
				catch(e) {}
				try { return new ActiveXObject("Msxml2.XMLHTTP.4.0"); }
				catch(e) {}
				try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
				catch(e) {}
				try { return new ActiveXObject("Msxml2.XMLHTTP"); }
				catch(e) {}
				try { return new ActiveXObject("Microsoft.XMLHTTP"); }
				catch(e) {}
				throw new Error("This browser does not support XMLHttpRequest.");
			};
		}
		this._xhr = new XMLHttpRequest();
		return this._xhr;
	},

	ajax : function(url, options)
	{
		options = options || {};
		var success = options.success || function(){};
		var error = options.error || function(){};
		var sync = options.sync == undefined ? true : false;
		var type = options.type || 'GET';
		var request = this.getAjaxReuqest();
		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				success(request.responseText);
			} else {
				//error(request);
			}
		};
		request.open(type, url, sync);
		request.send(null);
		if (sync === false) {
			success(request.responseText);
			return request.responseText;
		}
	},

	load : function(url)
	{
		var _self = this;
		return this.ajax(url, {
				type : "GET",
				sync : false,
				success : function(responseText) {
					_self._result = responseText;
				}
		});
	},

	getResult : function()
	{
		return this._result;
	}
};


/**
 * Use GData for loading pictures list data and parse the data,
 * as an object '{time : time, url : url}';
 * 
 * @access public
 * @return void
 */
function ImageList()
{
	this._list = [];
	this._current = -1;
	this.oData = new GData();
};
ImageList.prototype =
{
	load : function(url)
	{
		var content = this.oData.load(url);
		if (content) {
			this.onSuccess(content);
		} else {
			this.onError(content);
		}
		this.parseList(content);
	},

	// event:
	onSuccess : function()
	{
	},

	// event:
	onError : function()
	{
	},

	getList : function()
	{
		return this._list;
	},

	parseList : function(content)
	{
		if (!content) return;
		var lines = content.replace(/^\s*\r?\n$/, '').replace(/\r?\n$/, '').split(/\r?\n/);
		for (var i = 0, l = lines.length; i < l; i++) {
			var row = lines[i];
			var a = row.split(/\s+/);
			var data = {time : a[0], url : a[1]};
			this._list.push(data);
		}
		// sort:
		this._list.sort(function(a, b) {
				var atime = a.time.split(':');
				var btime = b.time.split(':');
				var minute_a = atime[0] * 60 + atime[1];
				var minute_b = btime[0] * 60 + btime[1];
				return minute_b - minute_a;
		});
		return this._list;
	},

	_cursor : function(offset) 
	{
		if (this._list.length >= this._current + offset && this._current + offset >= -1) {
			this._current = this._current + offset;
		}
	},

	prev : function()
	{
		this._cursor(-1);
		return this._list[this._current];
	},

	next : function()
	{
		this._cursor(1);
		return this._list[this._current];
	},

	get : function(time)
	{
		for (var i = 0, l = this._list.length; i < l; i++) {
			var data = this._list[i];
			if (data.time == time) {
				this._current = 0;
				return data;
			}
		}
		return false;
	}
};


/**
 * GTimer 
 * 
 * @access public
 * @return void
 */
function GTimer(minute)
{
	this._interval = minute || 0;
	this._tid = -1;
	this._func = [];
};
GTimer.prototype = 
{
	_checkTime : function()
	{
		var d = new Date();
		// if interval is '5', it will check if minutes is 05,10,15,20 ...
		return d.getSeconds() == 0 && (d.getMinutes() % this._interval == 0);
		//return Math.floor(d.getTime()/1000) % (this._interval * 60) == 0;
	},

	start : function()
	{
		if (this._interval <=0 ) return;
		var _self = this;
		this.tid = setInterval(function() {
				if (!_self._checkTime()) return false;
				// call all callback function:
				for (var i = 0, l = _self._func.length; i < l; i++) {
					_self._func[i]();
				}
		}, 1000);
	},

	stop : function()
	{
		clearInterval(this.tid);
	},

	setIntervalValue : function(value)
	{
		this._interval = value;
	},

	// add function into here:
	add : function(callback)
	{
		this._func.push(callback);
	}
};

/**
 * control image from image list.
 * 
 * @access public
 * @param string id : the '<img>' element id
 * @param ImageList oImageList
 * @return void
 */
function ImageManager(id, oImageList, options)
{
	this.id = id;
	this._imageList = oImageList;
	this._img = ''
	this.options = options || {};
	this._init();
};
ImageManager.prototype = 
{
	_init : function()
	{
		if (!this._imageList) {
			throw new Error('No class instant ImageList gave!');
		}
		this._img = document.getElementById(this.id);
	},

	showImage : function(url, isPreload)
	{
		var _self = this;
		isPreload = !!isPreload;
		this.onLoading();
		var oImage = new Image();
		oImage.src = url;
		oImage.onload = function() {
			if (!isPreload) {
				_self._img.src = url;
				_self.onLoad(_self._img);
			}
		};
	},
	
	// event
	onLoading : function()
	{
	},

	// event:
	onLoad : function(ui)
	{
	},

	show : function(d/*Date*/)
	{
		// current time, such as '00:50':
		var d = d || (new Date());
		var hours = d.getHours();
		var minute = d.getMinutes();
		if (hours < 10) hours = "0" + hours;
		if (minute < 10) minute = "0" + minute;
		var time = hours + ":" + minute;

		// if get url, show images:
		var data = this._imageList.get(time);
		if (data) {
			this.showImage(data.url, false);
			return true;
		}
		return false;
	},

	preload : function()
	{
		var data = this._imageList.next();
		if (data) {
			this.showImage(data.url, true);
			return true;
		}
		return false;
	},

	next : function()
	{
	}
};

/**
 * TimeGallery 
 * 
 * @access public
 * @return void
 */
function TimeGallery(options)
{
	this._timer = '';
	this._imageList = '';
	this._manager = '';
	this.options = this._setOptions(options);
	this._init();
};
TimeGallery.prototype = 
{
	_default : 
	{
		id 			: 	'', 	// image element id
		images_list : 	'', 	// images list url
		timeout 	: 	5, 		// change image on how many minutes
		preload 	: 	false,
		onLoading 	: 	'',
		onLoad 		: 	''
	},

	_init : function()
	{
		if (!this.options.id) {
			throw new Error('No id found!');
		}
		if (!this.options.images_list) {
			throw new Error('No images list gave!');
		}
		this._timer = new GTimer(this.options.timeout);
		this._imageList = new ImageList();
	},

	_setOptions : function(options)
	{
		var finalOptions = {};
		for (var key in this._default) {
			finalOptions[key] = (options[key] != undefined)
								? options[key]
								: this._default[key];
		}
		return finalOptions;
	},

	run : function()
	{
		var _self = this;

		this._imageList.load(this.options.images_list);

		this._manager = new ImageManager(this.options.id, this._imageList);

		this._manager.onLoading = this.options.onLoading || function() {
		};

		this._manager.onLoad = this.options.onLoad || function(ui) {
		}

		this._timer.add(function() {
			_self._manager.show();
			if (_self.options.preload) {
				_self._manager.preload();
			}
		});
		this._timer.start();
		this._manager.show();

	}
};

