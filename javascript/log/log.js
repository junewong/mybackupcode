/**
 * js log debugger;
 *
 * @author junewong
 * @date 2009-03-01
 */
var log = function(logType, message, object)
{
	// if log has been close, do noting:
	if (!log.options.enable) return;

	// if no div for showing log, try to create one:
	var logDiv =  document.getElementById('__log');
	if (!logDiv){
		if (log.options.autoCreate && document.body)
		{
			logDiv = document.createElement('div');
			logDiv.setAttribute('id', '__log');
			document.body.appendChild(logDiv);
		}
		else
		{
			// if document is not ready, store parameters into buffer
			log.buffer.push({logType: logType, message: message, object: object});
			return;
		}
	}

	// set css class if need:
	if (!logDiv.className)
	{
		logDiv.className = log.options.log_class;
	}

	// check length of arguments, can be 1 or 2:
	if (typeof object == "undefined" && typeof message != 'string')
	{
		object = message;
		message = '';
	}

	// css name:
	var message_class = 'message_class_' + logType;
	var value_class = 'value_class_' + logType;

	//add message :
	var msgDiv = document.createElement('div');
	msgDiv.className = log.options[message_class];
	var b = document.createElement('b');
	b.appendChild(document.createTextNode('[' + logType + '] '));
	msgDiv.appendChild(b);
	msgDiv.appendChild(document.createTextNode(message));
	logDiv.appendChild(msgDiv);

	var type = typeof object;

	// if just has message, return:
	if (type == 'undefined') return;

	// add object detail info:
	if (type == 'object')
	{
		var oFrag = document.createDocumentFragment();
		for (var i in object)
		{
			//check filter:
			if (log.filter.length > 0 && !log.filter[i]) continue;

			var value, attrType;
			try {
				value = object[i];
				attrType = typeof object[i];
			} catch(e) {
				value = '<unkonw value>';
				attrType = '<unknow type>';
			}
			if (attrType != 'function')
			{
				var tempDiv = document.createElement('div');
				tempDiv.appendChild(document.createTextNode(i + ' : ' + value));
				tempDiv.className = log.options[value_class];
				oFrag.appendChild(tempDiv);
			}
			else 
			{
				var tempDiv = document.createElement('div');
				tempDiv.appendChild(document.createTextNode(i + ' : ' + '{/* function code */}'));
				tempDiv.className = log.options[value_class];
				oFrag.appendChild(tempDiv);
			}
		}
		logDiv.appendChild(oFrag);
	}
	else if (type == 'function')
	{
		var objectDiv = document.createElement('div');
		objectDiv.className = log.options[value_class];
		var pre = document.createElement('pre');
		pre.appendChild(document.createTextNode(object.toString()));
		objectDiv.appendChild(pre);
		logDiv.appendChild(objectDiv);
	}
	else
	{
		var objectDiv = document.createElement('div');
		objectDiv.className = log.options[value_class];
		objectDiv.appendChild(document.createTextNode(object));
		logDiv.appendChild(objectDiv);
	}
}

log.debug = function(message, object)
{
	log('debug', message, object);
}

log.info = function(message, object)
{
	log('info', message, object);
}

log.warn = function(message, object)
{
	log('warning', message, object);
}

log.error = function(message, object)
{
	log('error', message, object);
}

log.buffer = [];

log.flush = function()
{
	if (document.body)
	{
		for (var i in log.buffer)
		{
			var param = log.buffer[i];
			log(param.logType, param.message, param.object);
		}
		log.buffer = [];
	}
}

/**
 * log content filter:
 */
log.filter = {};

/**
 * options:
 */
log.options = {
	enable 				: 	true,
	autoCreate 			: 	true,
	log_class 			:	'log',
	message_class_debug	: 	'log_message_debug',
	value_class_debug	: 	'log_value_debug',
	message_class_error	: 	'log_message_error',
	value_class_error 	: 	'log_value_error'
}

/**
 * catch error and show in the log
 */
if (log.options.enable)
{
	window.onerror = function(e)
	{
		log.error('Some error occur!', e);
		//return true;
	}
}

window.onload = function()
{
	// flush buffer:
	log.flush();
}
