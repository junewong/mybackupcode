/** 
 * This is a simple javascript MVC framework.  
 * 
 * Apps object is a componet container, we can create some 
 * componets which inherit ICtrl, IVIew or IModel interface 
 * and register themselves into the relevant Manager, such 
 * as Apps.Controllers, Apps.Views, Apps.Models.  
 * 
 * Then, Apps will check if 'Apps.main' function exists, if 
 * it has main function, just call it. Otherwise, call all 
 * 'run' functions in Apps view object, so, all componets 
 * will run and show on the page.  
 * 
 * Yet, if we want to get some template by ajax in view object 
 * before Apps run, we can call 'needTemplate' function in view, 
 * it can just record templates name in array 'Apps.templates', 
 * so, we can treat the array and load all templates in the 
 * main function.  
 * 
 * For using ajax and json, please include jquery.js and 
 * jquery.json.js before this file.  
 * 
 * For debug, please include log.js before this file.  
 * 
 * @author junewong 
 * @date 2009-03-12 
 */
  
(function(){

	// for faster reference: 
	var undefined, window = this, 

	/**
	 * Core class: 
	 */
	Apps = window.Apps = 
	{


		// some constant: 
		TYPE_CTRL 	: 	'ctrl', 
		TYPE_VIEW 	: 	'view', 
		TYPE_MODEL 	: 	'model', 
		TYPE_SHELL 	: 	'shell', 

		/**
		 * store all classes:
		 */
		classes : [],

		/** 
		 * load classess if accpet.
		 */
		load : function() 
		{
			log.info('Try to load classes! accept classes are:', this.acceptClasses.length > 0 ? this.acceptClasses :  'ALL');
			for (var i in this.classes)
			{
				if (this.checkAccpet(this.classes[i]._name))
				{
					this.classes[i].load();
				}
			}
		},
		
		/** 
		 * The start method for running This application.  
		 */
		run : function(options) 
		{
			if (typeof options == 'object') 
			{
				this.options = options;
			}

			log.info('Apps start to run! options is:', this.options);

			this.load();

			// if has main function, call it, default will 
			// call all views's 'run' function.  
			if (this.main) 
			{
				log.info('run main', this.Views.aViews[this.main]);
				this.Views.aViews[this.main].run();

			}
			else 
			{
				this.runAllViews();

			}


		},

		/**
		 * run all view classes:  
		 */
		runAllViews : function() 
		{
			log.info('runAllViews ... ');

			for (var i in this.Views.aViews) 
			{
				if (!this.main ||  (this.main && i != this.main))
				{

					this.Views.aViews[i].run();
				}
			}

		},

		/**
		 * check this class is accept ( be in Apps.classes array );  
		 */
		checkAccpet : function(name) 
		{
			return ( Apps.acceptClasses.length > 0 && !this.inArray(name, Apps.acceptClasses) ) ? false : true;
		},

		/**
		 * if the view class should load the html template,
		 * the method will keep the tempalte name in the array this.tempaltes,
		 * and you should load the html manually.
		 */
		needTemplate : function(tplName, viewName) 
		{
			this.templates.push(tplName);
		},

		/**
		 * check if value be in the array:  
		 */
		inArray : function( value, array ) {
			for ( var i = 0, length = array.length; i < length; i++ )
				if ( array[i] == value)
					return true;

			return false;
		}

	};

	/** 
	 * some configure.  
	 */
	Apps.config = 
	{
		AJAX_BASE_URL 	: 	'index.php?op=ajaxInterface' 
	};

	/** 
	 * This options can read by all subscribed class.  
	 */
	Apps.options = {};


	/** 
	 * set any views if we need to run it;
	 * if this array has value, 
	 */
	Apps.acceptClasses = [];


	/** 
	 * The main fuction, it will be call before 'run' function in all interface.  
	 * It should be a view class.  
	 */
	Apps.main = '';


	/** 
	 * An array for saving template that the view class need.  
	 */ 
	Apps.templates = [];


	/** 
	 * get a counter, can use differrent key.  
	 */
	Apps.counter = {};
	Apps.getCounter = function(key) 
	{
		if (!Apps.counter[key]) 
			Apps.counter[key] = 0;
		return Apps.counter[key]++;
	};

	/**
	 * append the config file into Apps.config;  
	 *
	 * @param config object : the object include all config data.
	 */
	Apps.addConfig = function(config)
	{
		for (var i in config)
		{
			Apps.config[i] = config[i];
		}
	},


	/**
	 * a simple data cache :   
	 */
	Apps.cache = 
	{
		data : {},

		set : function (key, value) 
		{
			this.data[key] = value;
		},

		get : function (key) 
		{
			return this.data[key];
		},

		remove : function (key) 
		{
			delete this.data[key];
		},

		clear : function () 
		{
			this.data = {};
		}
	};


	/** 
	 * By this funciton, we can inherit object with 
	 * any mvc interface.  
	 */ 
	Apps.extend = function(oParent, oChild) 
	{
		var f = function(){} ;

		var o = new f();

		if (typeof oParent == 'function')
		{

			var p = new oParent();
		}
		else if (typeof oParent == 'object')
		{
			var p = oParent;
		}

		for (var i in p) 
		{
			o[i] = p[i];
		}

		for ( i in oChild) 
		{
			o[i] = oChild[i];
		}

		Apps.classes.push(o);

		return o;
	};

	/** 
	 * Models manager;
	 */
	Apps.Models = 
	{

		aModels : [], 

		regModel : function(name, model) 
		{
			if (this.aModels[name]) return false;
			this.aModels[name] = model;
			//this.aModels[name].load();

		},

		removeModel : function(name) 
		{
			this.aModels[name].unload();
			delete this.aModels[name];

		},

		excute : function(message) 
		{
			log.info('Apps.Models received message:', message);

			if (! message instanceof Message) return false;

			if (message.type == Apps.TYPE_MODEL) 
			{
				try 
				{
					var model = this.aModels[message.target];
					if (!model) throw new Error('No Model  "' + message.target + '" found!');
					log.info('Apps.Models run model: ' , model);
					var result = model.run(message);
					return true;
				}
				catch(e) 
				{
					if (log.error) 
					{
						log.error('Apps.Models Catch Exception:', e);
					}
				}

			}
			return false;

		}

	};

	/** 
	 * Views manager;
	 */
	Apps.Views = 
	{
		aViews : [], 
				 
		regView : function(name, view) 
		{
			log.info('Apps regView: ', name);
			if (this.aViews[name]) return false;
			this.aViews[name] = view;
			//this.aViews[name].load();

		},

		removeView : function(name) 
		{
			if (this.aViews[name]) return false;
			this.aViews[name].unload();
			delete this.aViews[name];

		},

		excute : function(message) 
		{
			if (! message instanceof Message) return false;

			if (message.type == Apps.TYPE_VIEW) 
			{
				try 
				{
					// test target uri, eg: '/viewName/state'
					var uri = /^\/?(\w+)(?:\/(\w+))?$/.exec(message.target);

					var target = uri[1], state = uri[2], result;

					var view = this.aViews[target];

					if (!view) 
						throw new Error('No View "' + message.target + '" found!');

					if (!state)
					{
						result = view.run(message);
					}
					else
					{
						var stateHandle = view._states[state];
						if (!stateHandle)
						{
							throw new Error('Excute View "' + message.target + '" state not found!');
						}
						result = stateHandle.apply(view, [message]);
					}

					if (result === false) 
						throw new Error('Excute View "' + message.target + '" fail!');

					return true;

				}
				catch(e) 
				{
					if (log.error) 
					{
						log.error('Apps.Views.execute Catch Exception:', e);
					}
				}
			}

			return false;

		},

		getAttribute : function(uri, params)
		{
			log.info('Try to get attribute, uri: ', uri);
			params = params || [];

			try { 
				// test target uri, eg: '/viewName/attribute'
				var uriData = /^\/?(\w+)(?:\/(\w+))?$/.exec(uri);

				var target = uriData[1], attr = uriData[2], result;

				var view = this.aViews[target];

				if (!view)
					throw new Error("Target '" + uri + "' could not found!" );

				var attrHandle = view._attrs[attr];

				if (!attrHandle)
					throw new Error("Attribute '" + uri + "' could not found!" );

				return attrHandle.apply(view, params);

			} catch (e) {
				log.error('Apps.Views.getAttribute Catch Exception:', e);
			}
		}
	};

	/** 
	 * Controllers manager;
	 */
	Apps.Controllers = 
	{
		aCtrls : [], 
				 
		regCtrl : function(name, ctrl) 
		{
			if (this.aCtrls[name]) return false;
			this.aCtrls[name] = ctrl;
			//this.aCtrls[name].load();

		},

		removeCtrl : function(name) 
		{
			if (this.aCtrls[name]) return false;
			this.aCtrls[name].unload();
			delete this.aCtrls[name];

		},

		excute : function(message) 
		{
			if (! message instanceof Message) return false;

			if (message.type == Apps.TYPE_CTRL) 
			{
				log.info('Apps.Controllers received message: ', message);
				try 
				{
					var ctrl = this.aCtrls[message.target];

					if (!ctrl) 
						throw new Error('No Controller "' + message.target + '" found!');

					log.info('Apps.Controllers run ctrl: ' , ctrl);

					var result = ctrl.run(message);
					/* if (!result) throw new Error('Excute Controller "' + message.target + '" fail!'); */
					return true;

				}
				catch(e) 
				{
					if (log.error) 
					{
						log.error('Apps.Controllers Catch Exception:', e);

					}

				}

			}
			return false;

		}

	};


	/** 
	 * Model interface.  
	 */
	var IModel = window.IModel = function() 
	{
		this._name = '';

		this.regModel = function(ModelName) 
		{
			Apps.Models.regModel(ModelName, this);

		};

		this.removeModel = function(ModelName) 
		{
			Apps.Models.removeModel(ModelName, this);

		};

		this.sendMsg = function(CtrlName, content, type, func) 
		{
			var message;

			if (arguments.length == 1 && target instanceof Message) {
				message = target;
			} else {
				type = type || Apps.TYPE_CTRL;
				message = new Message(target, content, type, func);

			};
			message.fromTarget = this._name;
			message.fromType = Apps.TYPE_MODEL;
			log.info("IModel '" + this._name + "' send message to " + type + " '" + CtrlName + "', message is :", message);
			Apps.Controllers.excute(message);

		}; 

		this.load = function() 
		{

		};

		this.run = function() 
		{

		};

		this.unload = function() 
		{

		};

		this.callback = function(oldMsg, content, success)
		{
			var message = new Message(oldMsg.fromTarget, content, oldMsg.fromType);
			message.fromTarget = this._name;
			message.fromType = Apps.TYPE_MODEL;
			message.success = success == undefined ? oldMsg.success : success;
			message.note = oldMsg.note;
			log.info("IModel '" + this._name + "' try to callback:", message);
			oldMsg.callback(message);

		};

	};


	/** 
	 * View interface.  
	 */
	var IView = window.IView = function() 
	{
		this._name = '';

		this._states = {};

		this._attrs = {};

		this.regView = function(ViewName) 
		{
			Apps.Views.regView(ViewName, this);

		};

		this.removeView = function(ViewName) 
		{
			Apps.Views.removeView(ViewName, this);

		};

		this.sendMsg = function(target, content, type, func) 
		{
			if (arguments.length == 1 && target instanceof Message) 
			{
				var message = target;

			}
			else 
			{
				type = type || Apps.TYPE_CTRL;
				var message = new Message(target, content, type, func);

			};
			var message = new Message(target, content, type, func);
			message.fromTarget = this._name;
			message.fromType = Apps.TYPE_VIEW;
			log.info("IView '" + this._name + "' has sending message: ", message);

			switch (type)
			{
				case  Apps.TYPE_CTRL :
					Apps.Controllers.excute(message);
					break;
				case  Apps.TYPE_VIEW :
					Apps.Views.excute(message);
					break;
				case  Apps.TYPE_MODEL :
					Apps.Models.excute(message);
					break;
				default: 
					log.error('Unknow command type: ' + message.type);
			}

		};

		this.load = function() 
		{
		};

		// default state:
		this.run = function() 
		{
		};

		this.unload = function() 
		{
		};

		this.callback = function(oldMsg, content, success)
		{
			var message = new Message(oldMsg.fromTarget, content, oldMsg.fromType);
			message.fromTarget = this._name;
			message.fromType = Apps.TYPE_VIEW;
			message.success = success == undefined ? oldMsg.success : success;
			message.note = oldMsg.note;
			log.info("IView '" + this._name + "' try to callback:", message);
			oldMsg.callback(message);

		};

		// recorde which template this view needs.
		// You can call this method in 'load' state.
		// tpl : string, template name.
		this.needTemplate = function(tpl) 
		{
			Apps.needTemplate(tpl, this._name);
		};

		// register states of this view object,
		// You can also call this method in 'load' state.
		// state : string, state name.
		// handler : function handle
		this.regState = function(state, handler) 
		{
			this._states[state] = handler;
		};

		// register attributes of view object,
		// You can also call this method in 'load' state.
		// state : string 
		// handler : mixed can be variable or function
		this.regAttribute = function(attr, handler)
		{
			var value = (typeof handler == 'function')
						 ? handler
						 : function() { return this[attr]; };
			this._attrs[attr] = value;
		};

		// get the attribute of other view object.
		// uri : string
		// params : mixed any arguments.
		this.getAttribute = function(uri)
		{
			var params = Array.prototype.slice.call(arguments).slice(1);
			log.info("IView getAttribute uri '" + uri + "', and params:", params);
			return Apps.Views.getAttribute(uri, params);
		};
	};


	/** 
	 * Controller interface.  
	 */
	var ICtrl = window.ICtrl = function() 
	{

		this._name = '';

		this.regCtrl = function(CtrlName) 
		{
			Apps.Controllers.regCtrl(CtrlName, this);

		};

		this.removeCtrl = function(CtrlName) 
		{
			Apps.Controllers.removeCtrl(CtrlName, this);

		};

		this.sendMsg = function(target, content, type, func) 
		{
			var message;
			if (arguments.length == 1 && target instanceof Message) {
				message = target;
			} else {
				message = new Message(target, content, type, func);
			}
			message.fromTarget = this._name;
			message.fromType = Apps.TYPE_CTRL;
			log.info("ICtrl '" + this._name + "' sendMsg: ", message);
			switch (message.type) 
			{
				case Apps.TYPE_VIEW: 
					Apps.Views.excute(message);
					break;

				case Apps.TYPE_CTRL: 
					Apps.Controllers.excute(message);
					break;

				case Apps.TYPE_MODEL: 
					Apps.Models.excute(message);
					break;

				default: 
					log.error('Unknow command type: ' + message.type);
			}

		};

		this.load = function() 
		{

		};

		this.run = function() 
		{

		};

		this.unload = function() 
		{

		};

		this.callback = function(oldMsg, content, success)
		{
			var message = new Message(oldMsg.fromTarget, content, oldMsg.fromType);
			message.fromTarget = this._name;
			message.fromType = Apps.TYPE_CTRL;
			message.success = success == undefined ? oldMsg.success : success;
			message.note = oldMsg.note;
			log.info("ICtrl '" + this._name + "' try to callback:", message);
			oldMsg.callback(message);

		};

		// try to get an attribute value of a view.
		this.getAttribute = function(uri)
		{
			var params = Array.prototype.slice.call(arguments).slice(1);
			log.info("ICtrl view getAttribute uri '" + uri + "', and params:", params);
			return Apps.Views.getAttribute(uri, params);
		};

	};


	/** 
	 * Ajax connector, it will call the models in sever.  
	 */
	Apps.ajax = function(uri) 
	{
		if (! /^\/?(\w+)\/(\w+)\/?/.test(uri)) {
			log.error("uri " + uri + " has syntax error!");
			return {};
		}

		this.pModel = RegExp.$1;
		this.pCall  = RegExp.$2;

	};
	Apps.ajax.prototype = 
	{
		call : function(params, callbackFunc, options, crossDomain) 
		{
			crossDomain = crossDomain ? true : false;

			var url = Apps.config.AJAX_BASE_URL;
			var  data = "model=" + this.pModel + "&call=" + this.pCall + "&data=" + jQuery.toJSON(params);

			if (crossDomain) 
			{
				url += ((url.match(/\?/) ? '&' : '?') + 'callback=?');
			}
			if(jQuery) 
			{
				options 			= 	options || {};
				options.url 		= 	url;
				options.data 		= 	data;
				options.complete 	= 	function(data)
										{
											log.debug('complete data:', data.responseText);
											var decodeData = $.evalJSON(data.responseText);
											log.debug('ajax callback try to decode json: ', decodeData);
											callbackFunc(decodeData);

										};
				options.type 		= 	options.type || 'POST';
				if (crossDomain) 
				{
					options.dataType = 'jsonp';

				}
				options.jsonp 		= 	crossDomain ? 'callback' : '';
				log.info("Apps.ajax try to call server, the options is:", options);
				jQuery.ajax(options);

			}
			else 
			{
				log.error("Apps.ajax -- jQuery not found when making ajax call!");

			}

		}

	};


	/** 
	 * Simple template engine.  
	 * can support these tags: 
	 * 		[foreach data as alias] ... [/foreach] 
	 * 		[variables] or [object.attribute] 
	 * 		[if condition] ... [else] ... [/if]
	 *
	 * 	NOTE: all the 'src' attribute in '<img>' html tag, should be insteaded of 'src_tpl'!
	 */
	Apps.resource = function(sourceId) 
	{
		this.sourceId = sourceId;
		this.orginalHtml = '';
		this.data = {};
		this.init();
	};
	Apps.resource.prototype = 
	{
		init : function() 
		{
			log.info('init template object:', this.sourceId);
			var source = document.getElementById(this.sourceId);
			// fix charaters, and convert all lines into one line:
			this.orginalHtml = source.innerHTML.replace(/^\s+/g, '') 
												.replace(/(?:\n|\r)/g, '')
												.replace(/"/g, '\\"')
												.replace(/'/g, "\\'");
			// fix the attribute 'src' of <img> tag:
			this.orginalHtml = this.orginalHtml.replace(/(<img[^>]+)src_tpl\s*=([^>]+>)/ig, '$1src=$2'); 
		},

		setValue: function(key, value) 
		{
			this.data[key] = value;
		},

		getValue : function(key)
		{
			var value = this.data[key];

			if (typeof value == 'undefined') {
				log.error('Apps.resource key not found:', key);
			}
			return value || '';
		},

		fetch : function() 
		{
			var _self = this;
			var html = this.orginalHtml;

			// NOTE: DON'T write '[[if]]' tags as attribute of any html tag !!!
			// parse tag '[[if xx ? xx]] ... [[else]] ... [[/if]]'
			var reg_if_else = /\[\[\s*if\s+(.*?)\s*\]\](.*)\[\[else\]\](.*)\[\[\/if\]\]/ig;
			// for test if a variable by not string or integer
			var reg_var = /(?:[^'"]|^)\b([_a-z]\w+(?:(?:\[\w+\])?\.[-_a-z0-9\.]*)?)\b(?:[^"]|$)/ig;
			html = html.replace(reg_if_else, function(match) {
					var if_match = reg_if_else.exec(match);
					var condition = if_match[1];
					var content_if = if_match[2];
					var content_else  = if_match[3];
					condition = condition.replace(reg_var, "_self.getValue('$1') ").replace(/\\\'/g, '\'').replace(/\\\"/g, '\"');
					condition = '(' + condition + ')';
					var result = eval(condition) ? content_if : content_else;
					return result;
			});

			// parse tag '[[if xx ? xx]] ... [[/if]]'
			var reg_if = /\[\[\s*if\s+(.*?)\]\](.*)\[\[\/if\]\]/ig;
			html = html.replace(reg_if_else, function(match) {
					var if_match = reg_if_else.exec(match);
					var condition = if_match[1];
					var content_if = if_match[2];
					condition = condition.replace(reg_var, "_self.getValue('$1') ").replace(/\\\'/g, '\'').replace(/\\\"/g, '\"');
					condition = '(' + condition + ')';
					var result = eval(condition) ? content_if : '';
					return result;
			});


			// parse tag [[foreach obj as aliasName]]...[[/foreach]] : 
			var reg_foreach = /\[\[\s*foreach\s+(\w+)\s+as\s+(\w+)\s*\]\](.*)\[\[\/foreach\]\]/ig;
			html = html.replace( reg_foreach, function(match){
				reg_foreach.test(match);
				var objName = RegExp.$1, alias = RegExp.$2, content = RegExp.$3;
				var obj = _self.getValue(objName);

				if (!obj || (Array == obj.constructor && obj.length == 0) || (typeof obj == 'object' && obj.toString() == '') ) {
					return '';
				}

				var result = '';
				for (var i in obj) 
				{
					var key = /\d+/.test(i) ? i : "'"+i+"'";
					var realName = objName + '[' + key + ']';


					//log.debug('real name:', realName);///
					//replace alias name as real name. (eg: aliasName => obj[0]) 
					var re_var = "\\[\\[\\s*" + alias + "(\\.\\w+)?\\s*\\]\\]";
					var reg = RegExp(re_var, "g");
					result += content.replace(reg, "[["+realName+"$1"+"]]");


				}
				return result || match;

			});

			// parse tag '[[variable]]' or '[[object.attr]]', even [[object[0].attr]]: 
			html = html.replace(/\[\[\s*[_a-z0-9]+(?:(?:\[\w+\])?(?:\.[-_a-z0-9\.]*)?)?\s*\]\]/ig, function(match){
				// match if '[[object.attr]]', or [[object[0].attr]]: 
				/*
				if (_self.getValue(RegExp.$1) == undefined) {
					return '';
				}
				*/
				var variables;
				if (variables = /^\[\[\s*(\w+)((?:\[\w+\])?(?:\.\w+.*)?)?\s*\]\]$/.exec(match)) 
				{
					return "' + this.getValue('" + variables[1] + "')" + variables[2] + " + '";
				}
			});

			html = '(\'' + html + '\')';
			//log.debug('paser template: ', html);
			return eval(html);

		}

	};

	/**
	 * can be called by outter class.  
	 */
	Apps.shell = 
	{
		sendMsg : function(target, content, type, func)
		{
			var message;
			if (arguments.length == 1 && target instanceof Message) {
				message = target;
			} else {
				message = new Message(target, content, type, func);
			}
			message.fromTarget = '__shell__';
			message.fromType = Apps.TYPE_SHELL;
			log.info("Shell sendMsg: ", message);
			switch (message.type) 
			{
				case Apps.TYPE_VIEW: 
					Apps.Views.excute(message);
					break;

				case Apps.TYPE_CTRL: 
					Apps.Controllers.excute(message);
					break;

				case Apps.TYPE_MODEL: 
					Apps.Models.excute(message);
					break;

				default: 
					log.error('Unknow command type: ' + message.type);
			}

		}
	};

	/** 
	 * Message class, any one of MVC object will communicate to each other 
	 * by sending this message object.  
	 */
	var Message = window.Message = function(target, content, type, callback, success, fromTarget, fromType, note) 
	{
		this.target 	= 	target;
		this.content 	= 	content;
		this.type 		= 	type;
		this.callback	= 	callback || function() {};
		this.success 	= 	success || true;
		this.fromTarget	= 	fromTarget;
		this.fromType 	= 	fromType;
		this.note 		= 	note || '';

	};

}());
