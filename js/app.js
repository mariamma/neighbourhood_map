var initialLocations=[{
	locationName: "North Bergen"
},
{
	locationName: "Englewood"
},
{
	locationName: "Brooklyn"
},
{
	locationName: "Bayonne"
},
{
	locationName: "Harrison"
}
];

var Location = function(data){
	this.locationName = ko.observable(data.locationName);
}

var ViewModel = function(){
	var self = this;
	this.locationList = ko.observableArray([]);
	initialLocations.forEach(function(locationItem){
		self.locationList.push(new Location(locationItem));
	});
}

ko.applyBindings(new ViewModel());