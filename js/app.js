var FOURSQUARE_CLIENT_ID="3E5ADBQ2QBFKN5VLSFYLRAIBTWL1UZSBMCZZJIDB1RSSPNUO";
var FOURSQUARE_CLIENT_SECRET = "FR33XHKOTDZN3AH2CXNNDQ3U4CXHNGFBYNMRH1JB11XMEVEZ";
var map;
var markers = [];
var initialLocations;
var googleMapUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBxM7ybr9xCOF45j3UWwkvwhVeq__i02U4&libraries=geometry&callback=initMap";

$.getScript(googleMapUrl)
  .done(function() {
    console.log("Map loaded success");
  })
  .fail(function() {
    console.log("Map could not be loaded!!");
    var mapInfo = document.getElementById("map");
    mapInfo.innerHTML = "Service not availeble";
  });


function initMap() {
    map = new google.maps.Map(document.getElementById("map"),{
        center: {lat:40.7413549, lng:-73.99802439999996},
        zoom:13
    });

	var defaultIcon = makeMarkerIcon('FF5733');
  var highlightedIcon = makeMarkerIcon('FF0000');
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

var Location = function(data){
	this.title = ko.observable(data.title);
	this.location = ko.observable(data.location);
	this.fsid = ko.observable(data.fsid);
	var marker = new google.maps.Marker({
            position: data.location,
            title: data.title,
            animation: google.maps.Animation.DROP,
            map:map,
            icon: defaultIcon
          });
	this.marker = ko.observable(marker);
	this.active = ko.observable(true);
  this.clicked = ko.observable(false);
};

var ViewModel = function(station){
	var self = this;
	this.locationList = ko.observableArray([]);
  this.stationInput = ko.observable(station);

  $.ajax({
          dataType: "json",  
          url: "input.json",
          method: 'GET',
        }).done(function(result) {
            initialLocations = result;
            console.log(result);

            initialLocations.forEach(function(locationItem){
              self.locationList.push(new Location(locationItem));
            });

            self.locationList().forEach(function(locationItem){
              var position = locationItem.location();
                  var title = locationItem.title();
                    // Create a marker per location, and put into markers array.
                  var marker = locationItem.marker();
                  var fsid = locationItem.fsid();
                  locationItem.marker().addListener('mouseover', function() {
                      this.setIcon(highlightedIcon);
                    });
                locationItem.marker().addListener('mouseout', function() {
                      if(locationItem.clicked() == false){
                        this.setIcon(defaultIcon);  
                      }
                    });
                locationItem.marker().addListener('click', function() {
                      for(var i=0;i<self.locationList().length;i++){
                          self.locationList()[i].clicked(false);
                          self.locationList()[i].marker().setIcon(defaultIcon);
                        }
                      locationItem.clicked(true);  
                      locationItem.marker().setIcon(highlightedIcon);
                      populateInfoWindow(this, largeInfowindow, fsid);
                    });

                  bounds.extend(marker.position);
                    // Push the marker to our array of markers.
                  markers.push(marker);
                
            });

            map.fitBounds(bounds);

        }).fail(function(err) {
          console.log("Error while recieving foursquare data");
        });  

	

	
	this.handleLocationClick = function(location){
    for(var i=0;i<self.locationList().length;i++){
      self.locationList()[i].clicked(false);
      self.locationList()[i].marker().setIcon(defaultIcon);
    }
    location.clicked(true);  
    location.marker().setIcon(highlightedIcon);
		populateInfoWindow(location.marker(), largeInfowindow, location.fsid());
	};

	this.handleFilterKeyUp = function(){
		var input, filter, ul, li, a;
    	input = self.stationInput();
    	filter = input.toUpperCase();
	    console.log("Length = " + this.locationList().length);
	    for(var i=0;i<this.locationList().length;i++){
	    	var title = this.locationList()[i].title();
	    	if (title.toUpperCase().indexOf(filter) > -1) {
	    		this.locationList()[i].active(true);
	    		this.locationList()[i].marker().setVisible(true);
	    	}else{
	    		this.locationList()[i].active(false);
	    		this.locationList()[i].marker().setVisible(false);
	    	}
	    }
	};

	this.handleMenuClick = function(){
		var menu = document.querySelector('#menu');
      	var drawer = document.querySelector('.nav');
	    drawer.classList.toggle('open');
	    var el = document.getElementById("map");
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
};

ko.applyBindings(new ViewModel(""));

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

function highlightSelectedMarker(markerList, marker){
    console.log("Highlight selected marker " + markerList);
    markerList.forEach(function(markerItem){
      markerItem.setIcon(defaultIcon);
    });
    marker.setIcon(highlightedIcon);
  }; 

 function populateInfoWindow(marker, infowindow, fsid) {
    var defaultIcon = makeMarkerIcon('FF5733');
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation = data.location.latLng;
              var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position);
                //infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
                };
              var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
            } else {
              infowindow.setContent('<div>' + marker.title + '</div>' +
                '<div>No Street View Found</div>');
            }
          }
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          //infowindow.setContent('');
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div><div id="fsinfo"></div>');
          //infowindow.setContent('<div>' + marker.title + '</div>');
          //infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            console.log("Closing window " + infowindow.marker + " marker " + marker);
            // infowindow.marker.setIcon(defaultIcon);
            marker.setIcon(defaultIcon);
            infowindow.marker = null;
          });
          var streetViewService = new google.maps.StreetViewService();
          var radius = 50;
           // panorama from that and set the options
          

          // Use streetview service to get the closest streetview image within
          // 50 meters of the markers position
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          // Open the infowindow on the correct marker.
          infowindow.open(map, marker);
        }
        console.log("Fsid::" + fsid);
        var foursquareurl = "https://api.foursquare.com/v2/venues/" + fsid;
	      foursquareurl += '?' + $.param({
	    	  'v': '20170101',
	    	  'client_id': FOURSQUARE_CLIENT_ID,
	          'client_secret': FOURSQUARE_CLIENT_SECRET
	        });	
        		
        $.ajax({
          dataType: "json",  
          url: foursquareurl,
          method: 'GET',
        }).done(function(result) {
            // var photoUrlPrefix = result.response.venue.bestPhoto.prefix;
            // var photoUrlSuffix = result.response.venue.bestPhoto.suffix;
            // var photoUrl = photoUrlPrefix + "height150" + photoUrlSuffix;
            var shortUrl = result.response.venue.shortUrl;
            var fsInfo = document.getElementById("fsinfo");
            fsinfo.innerHTML = "<a href="+ shortUrl +">Foursquare Info</a>";
        }).fail(function(err) {
          console.log("Error while recieving foursquare data");
          var fsInfo = document.getElementById("fsinfo");
          fsinfo.innerHTML = "Four square image not available";
        });
      }     

 function mapError(){
    console.log("Map could not be loaded!!");
 };
      