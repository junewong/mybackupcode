(function() {

 	/**
 	 * get the dom by id;
 	 * 
 	 * @param string $id 
 	 * @return object dom
 	 */
 	function id(id) 
	{
		return document.getElementById ? document.getElementById(id) : null;
	};

	/**
	 * get a different id;  
	 */
	var curId = (function(){
		var id = 0;
		return function() {
			log.debug('curId: ', id);
			return id++;
		};
	})();

	var JPage, undefined;
	window.JPage = JPage = function() 
	{	
		this.id = 0;

		/**
		 * contain:
		 * 		container string : the id of final html div;  
		 * 		dataSrc string : the src of the iframe that load the data;
		 * 		scripts array : all script to load;
		 * 		css 	array : all css to load;
		 * 		templates array : all templates to load;
		 * 		template_id : the id of the template for loading data;
		 */
		this.options = {};

		this.config = 
		{
			'data_dir' : 'data/',
			'template_dir' : 'JPage/templates/',
			'templates_container' : '__templates'
		};
	};

	JPage.prototype =
	{
		/**
		 * parse data:
		 * syntax:
		 * 		@name : a varable:
		 * 		@name[] : a array variable;
		 * 		##: a value in an array;
		 */
		parseData  : function(source)
		{
			var data = source.split(/(?:^|\n+)@/);
			log.debug('data array:', data);
			var result = {};
			for (var i = 0, len = data.length; i < len; i++)
			{
				log.debug(i + ': exec data:', data[i]);
				var match;
				// match if @param  or @param[] :
				if (match = /^((\w+)(\[\])?)\s*:\s*\n([\s\S]+)(?:\n)*$/.exec(data[i]))
				{
					var key, value;
					// if it's @param[]:
					if (match[3])
					{
						key = match[2];
						var re = /[^^]##\s*:\s*\n+/;
						// if has seperate code '##:':
						if (re.test(match[4])) 
						{
							value = match[4].split(re);
						}
						else
						// otherwise, will split by '\n':
						{
							value = match[4].split(/\n+[^$]/);
						}
					}
					// if it's @param:
					else
					{
						key = match[2];
						value = match[4];
					}
					log.debug('match key: ', match);
					result[key] = value;
				}
						
			}
			log.debug('result:', result);
			return result;
		},

		parseTemplate : function(tplName, data)
		{
			var tpl = new Template(tplName);
			for (var key in data)
			{
				tpl.setValue(key, data[key]);
			}
			var html = tpl.fetch();
			log.info('parse template from "' + tplName + '":', html);
			return html;
		},
				 
		loadPage : function(tplName, dataName)
		{
			log.info('try to load template and data: ', tplName + ' | ' + dataName);

			var _self = this;

			var dataUrl = this.config['data_dir'] + dataName;

			var oData = new Data({

					url : dataUrl,

					success : function(source) {
						log.info('get source "' + dataUrl + '" : ', source);
						var data = _self.parseData(source);
						html = _self.parseTemplate(tplName, data);
						var container = _self.options['container'];
						id(container).innerHTML = html;
					},

					error : function() {
						log.error('load ' + url + ' fail!');
					}
			});

		},

		loadScripts : function(scripts)
		{
			if (scripts)
			{
				var head = document.getElementsByTagName('body')[0];
				for ( var i in scripts)
				{
					var script = document.createElement('script');
					script.type = "text/javascript";
					script.src = scripts[i];
					head.appendChild(script);
				}
			}
		},

		loadCss : function(allCss)
		{
			if (allCss)
			{
				var head = document.getElementsByTagName('head')[0];
				for ( var i in allCss)
				{
					var link = document.createElement('link');
					link.type = "text/css";
					link.rel = "stylesheet";
					link.href = allCss[i];
					head.appendChild(link);
				}
				head.appendChild(link);
			}
		},

		/**
		 * load template:
		 *
		 * @param templates array : all template name;
		 * @param callback function : the callback function if success;
		 */
		loadTemplates : function(templates, callback)
		{
			if (templates)
			{
				callback = callback || function() {};

				var _self = this;

				var templates_id =  this.config['templates_container'];

				// if has no container for templates, create it:
				if ( !id(templates_id) )
				{
					var body = document.getElementsByTagName('body')[0];
					var tpl_div = document.createElement('div');
					tpl_div.id = templates_id;
					tpl_div.style.display = 'none';
					body.appendChild(tpl_div);
				}

				var cnt = 0, total = templates.length;

				// then load all templates:
				for (var i in templates)
				{
					var url = _self.config['template_dir'] + templates[i];

					log.info('try to load template: ', url);

					new Data({
						url : url,

						success : function(source) {
							/*
							var oFrag  = document.createDocumentFragment();
							oFrag.innerHTML = source;
							id(templates_id).appendChild(oFrag);
							*/
							id(templates_id).innerHTML += source;
							// if all success, callback:
							if (++cnt == total) {
								log.info('load template all success. and try to callback!', cnt);
								callback();
							}
						},

						error : function() {
							log.error('load template "' + url + '" fail!');
						}
					});
				}
			}
		},

		init : function()
		{
			// load css:
			var allCss = this.options['css'];
			this.loadCss(allCss);

			// load scripts:
			var scripts = this.options['scripts'];
			this.loadScripts(scripts);
		},

		run : function(options)
		{
			var _self = this;

			this.options = options || {};
			log.info('start to run! and options ara: ', this.options);

			this.init();

			// load templates, then load data and create page:
			this.loadTemplates(this.options['templates'], function() {
					var tplName = _self.options['template_id'];
					var dataSrc = _self.options['dataSrc'];
					_self.loadPage(tplName, dataSrc);
			});
		},

		destroy : function()
		{
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
	var Template = function(sourceId) 
	{
		this.sourceId = sourceId;
		this.orginalHtml = '';
		this.data = {};
		this.init();
	};
	Template.prototype = 
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
				log.error('Template key not found:', key);
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
	 * The loader for any data for using iframe;
	 * 
	 * @param options $options 
	 * @return void
	 */
	var Data;
	window.Data = Data = function()
	{
		var options = typeof arguments[0] == 'object' ?  arguments[0] : {}
		
		if (typeof arguments[0] == 'string')
		{
			options = arguments[0];
			options['success'] = arguments[1];
		}

		this.url 		= options['url'] || '';
		this.loading 	= options['loading'] || function(){};
		this.success 	= options['success'] || function(){};
		this.error 		= options['error'] || function(){};

		if (this.url)
		{
			this.run();
		}
	};
	Data.prototype =
	{
		getIframeName : function()
		{
			return 'iframe_' + curId();
		},

		run : function()
		{
			var _self = this;

			var iframe = document.createElement('iframe');
			iframe.src = this.url;
			iframe.name = iframe.id = this.getIframeName();
			iframe.style.display = 'none';
			log.debug('data create iframe:', 'name: ' + iframe.name + "  |  src: " + iframe.src);

			// loading:
			this.loading();

			// callback:
			iframe.onload = function() {
				var source = self[this.name].document.body.innerHTML || '';
				if (typeof source != 'undefined') {
					// success:
					_self.success(source);
				} else {
					// fail:
					_self.error();
				}
				// clear:
				setTimeout(function() {
					iframe.parentNode.removeChild(iframe);
				}, 1);
			}

			var body = document.getElementsByTagName('body')[0];
			body.appendChild(iframe);
		},
	};


})();
