var form1_view = Apps.extend( IView, {

	_name : 'form1_view',

	load : function()
	{
		this.regView(this._name);
	},

	run : function()
	{
		var _self = this;
		$('#btn1').click(function(){
			log.debug('btn1 is click!');
			$('#content1').slideToggle();
		});

		$('#btn_submit').click(function() {
			log.debug('submit is click!');
			_self.sendMsg('test_submit', 'test string!');
			return false;
		});
	},

	unload : function()
	{
	}

});

var test_submit = Apps.extend( ICtrl, {

	_name : 'test_submit',

	load : function()
	{
		this.regCtrl(this._name);
	},

	run: function(message)
	{
		//alert(message.content);
		//var returnMessage = new Message(message.from, ');
		//sendMsg();
		log.debug('test_submit run!');
		this.sendMsg('test_model', '', Apps.TYPE_MODEL, this.callBack);
		
	},

	callBack : function(data)
	{
		for( var i in data)
		{
			alert(i + ' : ' + data[i]);
		}
	}

});

var test_model = Apps.extend( IModel, {

	_name : 'test_model',

	load : function()
	{
		this.regModel(this._name);
	},

	run: function(message)
	{
		log.debug('test_model run!');
		var data = {
			_name : 'wong',
			age  : 25
		};
		message.callback(data);
	}

});
