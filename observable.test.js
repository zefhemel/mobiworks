console.log("Loaded!");
var zef = observable.object( {
	name : "Zef Hemel",
	age : 26
});
zef.subscribe("set", function(type, property, value) {
	console.log(property + " := " + value);
});
zef.name = "Zef";

var people = observable.list();
people.subscribe("add", function(type, person) {
	console.log("Added person");
	console.log(person);
});
people.add(zef);
console.log("Done!");