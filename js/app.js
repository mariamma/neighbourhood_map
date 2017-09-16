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
	locationName: "Maplewood"
},
{
	locationName: "Irvington"
},
{
	locationName: "Elizabeth"
},
{
	locationName: "Summit"
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

	this.handleFilterKeyUp = function(){
		var input, filter, ul, li, a;
    	input = document.getElementById("stationinput");
    	filter = input.value.toUpperCase();
    	ul = document.getElementsByClassName("nav__list");
	    li = ul[0].getElementsByTagName("li");
	    console.log("Filter :: " + filter);
	    for (var i = 0; i < li.length; i++) {
	    	a = li[i].getElementsByTagName("span")[0];
	    	console.log("List value = " + a.innerHTML.toUpperCase() + " " + a.innerHTML.toUpperCase().indexOf(filter));
	        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
	            li[i].style.display = "";
	        } else {
	            li[i].style.display = "none";

	        }
	    }
	};

}

ko.applyBindings(new ViewModel());