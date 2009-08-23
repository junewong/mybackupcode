(function() {

 	function id(id) 
	{
		return document.getElementById ? document.getElementById(id) : null;
	};

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
		 */
		this.options = {};

		this.config = 
		{
			'data_dir' : 'data/'
		};
	};

	JPage.prototype =
	{
		getId : function()
		{
			return this.id ++;
		},

		getIframeName : function()
		{
			return 'iframe_' + this.getId();
		},

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

		parseTemplate : function(data)
		{
			var html;
			html = data; // test!
			return html;
		},
				 
		loadPage : function()
		{
			var _self = this;

			var iframe = document.createElement('iframe');
			iframe.src = this.config['data_dir'] + this.options['dataSrc'];
			iframe.name = iframe.id = this.getIframeName();
			iframe.style.display = 'none';

			// callback:
			iframe.onload = function() {
				var source = self[iframe.name].document.body.innerHTML || '';
				//log.debug('get source ' + iframe.name + ' : ', source);
				var data = _self.parseData(source);
				html = _self.parseTemplate(data);
				var container = _self.options['container'];
				id(container).innerHTML = html;
				// clear:
				setTimeout(function() {
					iframe.parentNode.removeChild(iframe);
				}, 1);
			}

			var body = document.getElementsByTagName('body')[0];
			body.appendChild(iframe);
		},

		loadScript : function(scripts)
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
				var head = document.getElementsByTagName('body')[0];
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

		init : function()
		{
			// load css:
			var allCss = this.options['css'];
			this.loadCss(allCss);

			// load scripts:
			var scripts = this.options['scripts'];
			this.loadScript(scripts);
		},

		run : function(options)
		{
			this.options = options || {};

			this.init();

			this.loadPage();
		},

		destroy : function()
		{
		}
	};

})();
