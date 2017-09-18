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


function initMap() {
    map = new google.maps.Map(document.getElementById("map"),{
        center: {lat:40.7413549, lng:-73.99802439999996},
        zoom:13
    });

	var defaultIcon = makeMarkerIcon('FF5733');
    var highlightedIcon = makeMarkerIcon('FF0000');
    var largeInfowindow = new google.maps.InfoWindow();

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


	this.locationList().forEach(function(locationItem){
		console.log("Location : " + locationItem.location() + " " + locationItem.title());
		var position = locationItem.location();
        var title = locationItem.title();
        console.log("Map :: " + map);
          // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            map:map,
            icon: defaultIcon
          });
          // Push the marker to our array of markers.
        markers.push(marker);
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
          });
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
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
	};
}

ko.applyBindings(new ViewModel());

		
}

function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 40),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(22,40));
        return markerImage;
      }

 function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
        }
      }     
