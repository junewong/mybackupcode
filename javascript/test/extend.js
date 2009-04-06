function extend(parentClass, childClass)
{
	/*
	parentClass.apply(childClass, []);

	if (typeof childClass.initialize != 'undefined' )
	{
		childClass.initialize();
	}
	*/

	//showProp(childClass);///
	var newClass = function(){};

	newClass.prototype = new parentClass();
	for (var i in childClass)
	{
		newClass.prototype[i] = childClass[i];
	}
	return newClass;
}

ClassA = function()
{
	this.a = 1;
	this.b = 2;

	this.func1 = function(name)
	{
		alert("I'm a " + name);
	}
}

var ClassB = extend(ClassA, {
		func2 : function(id, name)
		{
			alert("You id is " + id + " and your name is " + name);
		}
});


function showProp(obj)
{
	for (var i in obj)
	{
		alert(i + " : " + obj[i]);
	}
}

var a = new ClassA();
alert('ClassA a is ' + a.a);

var b = new ClassB();
//showProp(ClassB);///

b.func2(10, 'wong');
b.func1('wong');
alert('ClassB a is ' + b.a);
