Apps.extend( IView, {

	_name : 'list_view',

	load : function()
	{
		this.regView(this._name);
	},

	run : function()
	{
		var _self = this;
		$('#btn_add').click(function(){
			var value = $('#listName').val();
			log.debug('button btn_add is click!' );
			_self.sendMsg('addList', value, '', function(value){
				_self.add(value);
			});
		});

		$('#btn_remove').click(function(){
			log.debug('button btn_remove is click!' );
			_self.sendMsg('removeList', '', '', function(value){
				_self.remove();
			});
		});
	},

	add : function()
	{
		$('#list').append('<div>Title:</div>');
	},

	remove : function()
	{
		$('#list').find(':last').remove();
	},

	unload : function()
	{
	}

});

Apps.extend( ICtrl, {
	_name : 'addList',

	load : function()
	{
		this.regCtrl(this._name);
	},

	run: function(message)
	{
		log.debug('ctrl ' + this._name + ' run!');
		var _self = this;
		var value = message.content;
		var msg = new Message('listModel', value, Apps.TYPE_MODEL, function(data){
			message.callback(data);
		}, this._name);
		this.sendMsg(msg);
	},

	unload : function()
	{
	}
});

Apps.extend( IModel, {
	_name : 'listModel',

	load : function()
	{
		this.regModel(this._name);
	},

	run: function(message)
	{
		var value = message;
		var data = '<b>' + message.content + '</b>';
		message.callback(data);
	},

	unload : function()
	{
	}
});
