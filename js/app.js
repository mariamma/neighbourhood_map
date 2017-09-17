var map;
var markers = [];
var initialLocations=[
		  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
          {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
          {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
          {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
          {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
          {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

var Location = function(data){
	this.title = ko.observable(data.title);
	this.location = ko.observable(data.location);


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

	this.handleMenuClick = function(){
		var menu = document.querySelector('#menu');
      	var drawer = document.querySelector('.nav');
	    drawer.classList.toggle('open');
	    var el = document.getElementById("map")
	    var headerTag = document.getElementById("header");
	    var menuEl = document.getElementById("menu");
	    var slideheading = document.getElementById("slideHeading");
	    if ( el.style.marginLeft==="300px" ) {
			    el.style.marginLeft="0px";
			    menuEl.style.marginLeft="0px";
			    headerTag.style.marginLeft="0px";
		} else {
			    el.style.marginLeft="300px";
			    menuEl.style.marginLeft="300px";
			    headerTag.style.marginLeft="300px";
		} 
	}
}

ko.applyBindings(new ViewModel());

		
	function initMap() {
       // TODO: use a constructor to create a new map JS object. You can use the coordinates
       // we used, 40.7413549, -73.99802439999996 or your own!
        map = new google.maps.Map(document.getElementById("map"),{
            center: {lat:40.7413549, lng:-73.99802439999996},
            zoom:13
         });

        initialLocations.forEach(function(locationItem){
          // Get the position from the location array.
          var position = locationItem.location;
          var title = locationItem.title;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            map:map
          });
          // Push the marker to our array of markers.
          markers.push(marker);
		});
     }