/*
function extend(oParent, oChild)
{
	if (typeof oParent == 'function' && typeof oChild == 'function')
	{
		for (var i in oParent)
		{
			log.debug('extend prop: ',  i + ' : ' + oParent[i]);
			oChild[i] = oParent[i];
		}
		return oChild;
	}
	return {};
}
*/



var Apps =
{
	TYPE_CTRL : 'ctrl',
	TYPE_VIEW : 'view',
	TYPE_MODEL : 'model',

	run : function()
	{
		for (var i in this.Views.aViews)
		{
			this.Views.aViews[i].run();
		}
	}
}

Apps.extend = function(oParent, oChild)
{
	var f = function(){};
	var o = new f();
	var p = new oParent();
	for (var i in p)
	{
		o[i] = p[i];
	}

	for (var i in oChild)
	{
		o[i] = oChild[i];
	}
	if (o.load)
	{
		o.load();
	}
	return o;

}

var AppsInstance;
Apps.getInstance = function()
{
	return AppsInstance || (AppsInstance = new Apps());
}

//Apps.prototype.Models = function(){};
Apps.Models = 
{

	aModels : [],

	regModel : function(_name, model)
	{
		if (this.aModels[_name]) return false;
		this.aModels[_name] = model;
		this.aModels[_name].load();
	},

	removeModel : function(_name)
	{
		delete this.aModels[_name];
	},

	excute : function(message)
	{
		if (! message instanceof Message)
			return false;

		if (message.type == Apps.TYPE_MODEL) 
		{
			log.debug('Models, get message: ', message);
			try {
				var model = this.aModels[message.target];
				log.debug('Models get model: ' , model);
				if (!model) 
					throw new Error('No Model  "' + message.target + '" found!');
				var result = model.run(message);
				return true;
			} catch(e) {
				if (log.error)
				{
					log.error('Catch Exception:', e);
				}
			}
			
		}
		return false;
	}
}

//Apps.prototype.Views = function(){};
Apps.Views = 
{
	aViews : [],

	regView : function(_name, view)
	{
		log.debug('Apps regView: ', _name);
		if (this.aViews[_name]) return false;
		this.aViews[_name] = view;
		this.aViews[_name].load();
	},

	removeView : function(_name)
	{
		if (this.aViews[_name]) return false;

		delete this.aViews[_name];
		this.aViews[_name].unload();
	},

	excute : function(message)
	{
		if (! message instanceof 'Message')
			return false;

		if (message.type == Apps.TYPE_VIEW) 
		{
			try {
				var view = this.aViews[message.target];
				if (!ctrl) 
					throw new Error('No View "' + message.target + '" found!');
				var result = view.excute(message);
				if (!result)
					throw new Error('Excute View "' + message.target + '" fail!');
				return true;
			} catch(e) {
				if (log.error)
				{
					log.error('Catch Exception:', e);
				}
			}
			
		}
		return false;
	}
}

//Apps.prototype.Controllers = function()
Apps.Controllers = 
{
	aCtrls : [],

	regCtrl : function(_name, ctrl)
	{
		if (this.aCtrls[_name]) return false;
		this.aCtrls[_name] = ctrl;
		this.aCtrls[_name].load();
	},

	removeCtrl : function(_name)
	{
		if (this.aCtrls[_name]) return false;
		delete this.aCtrls[_name];
		this.aCtrls[_name].unload();
	},

	excute : function(message)
	{
		if (! message instanceof Message)
			return false;

		if (message.type == Apps.TYPE_CTRL) 
		{
			log.debug('Controllers, get message: ', message);
			try {
				var ctrl = this.aCtrls[message.target];
				log.debug('Controllers get ctrl: ' , ctrl);
				if (!ctrl) 
					throw new Error('No Controller "' + message.target + '" found!');
				var result = ctrl.run(message);
				/*
				if (!result)
					throw new Error('Excute Controller "' + message.target + '" fail!');
				*/
				return true;
			} catch(e) {
				if (log.error)
				{
					log.error('Catch Exception:', e);
				}
			}
			
		}
		return false;
	}
}

function IModel()
{
	this._name = '';

	// 注册模型 
	this.regModel = function(ModelName)
	{
		Apps.Models.regModel(ModelName, this);
	}

	// 取消注册模型 
	this.removeModel = function(ModelName)
	{
		Apps.Models.removeModel(ModelName, this);
	}

	// 发送消息给控制器 
	this.sendMsg = function(CtrlName, Message, type, func)
	{
		type = type || Apps.TYPE_CTRL;
		var message = new Message(target, type, content, this._name);
		Apps.Views.excute(message);
	}

	this.callback = function(content)
	{
	}

}

function IView()
{
	this._name = '';

	// 注册视图 
	this.regView = function(ViewName)
	{
		Apps.Views.regView(ViewName, this);
	}

	// 取消注册视图 
	this.removeView = function(ViewName)
	{
		Apps.Views.removeView(ViewName, this);
	}

	// 发送消息给控制器 
	this.sendMsg = function(target, content, type, func)
	{
		type = type || Apps.TYPE_CTRL;
		var message = new Message(target, content, type, func, this._name);
		log.debug('IView has sending message: ', message);
		Apps.Controllers.excute(message);
	}

	this.load = function() {}

	this.run = function() {}

	this.unload = function() {}
}

function ICtrl()
{
	this._name = '';

	// 注册控制器 
	this.regCtrl = function(CtrlName)
	{
		Apps.Controllers.regCtrl(CtrlName, this);
	}

	// 取消注册控制器 
	this.removeCtrl = function(CtrlName)
	{
		Apps.Controllers.removeCtrl(CtrlName, this);
	}

	// 发送消息给视图或模型
	this.sendMsg = function(target, content, type, func, from)
	{
		if (arguments.length == 1 && target instanceof Message) {
			var message = target;
		} else {
			var message = new Message(target, content, type, func, this._name);
		}
		log.debug('ICtrl sendMsg: ', message);
		if (type == Apps.TYPE_VIEW) {
			Apps.Views.excute(message);
		} else if (type == Apps.TYPE_CTRL) {
			Apps.Controllers.excute(message);
		} else if (type == Apps.TYPE_MODEL) {
			Apps.Models.excute(message);
		}
		
	}

	this.load = function() {}

	this.run = function() {}

	this.unload = function() {}
}

var Message = function(target, content, type, func, from, sucess)
{
	this.target 	= target;
	this.content 	= content;
	this.type 		= type;
	this.from 		= from;
	this.callback	= func || function(){};
	this.sucess 	= sucess || true;
}

