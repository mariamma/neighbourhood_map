var FOURSQUARE_CLIENT_ID="3E5ADBQ2QBFKN5VLSFYLRAIBTWL1UZSBMCZZJIDB1RSSPNUO";
var FOURSQUARE_CLIENT_SECRET = "FR33XHKOTDZN3AH2CXNNDQ3U4CXHNGFBYNMRH1JB11XMEVEZ";
var map;
var markers = [];
var initialLocations=[
		  {title: 'Park Ave Penthouse', 
		   fsid: '49d51ce3f964a520675c1fe3',
		   location: {lat: 40.7713024, lng: -73.9632393}
			},
          {title: 'Chelsea Loft', 
           fsid: '4e3b11853151eaa7c4399f41', 
           location: {lat: 40.7444883, lng: -73.9949465}
      		},
          {title: 'Union Square Open Floor Plan', 
           fsid: '3fd66200f964a520def11ee3',
           location: {lat: 40.7347062, lng: -73.9895759}
      		},
          {title: 'East Village Hip Studio', 
           fsid: '4f039c3993ad64af7a3a1dc3',
           location: {lat: 40.7281777, lng: -73.984377}
      		},
          {title: 'TriBeCa Artsy Bachelor Pad', 
           fsid: '5670c613498e20ec8ac58aee',	
           location: {lat: 40.7195264, lng: -74.0089934}
      		},
          {title: 'Chinatown Homey Space', 
           fsid: '4e885acb0cd6eb4081add389',
           location: {lat: 40.7180628, lng: -73.9961237}
      		}
];


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
};

var ViewModel = function(){
	var self = this;
	this.locationList = ko.observableArray([]);

	initialLocations.forEach(function(locationItem){
		self.locationList.push(new Location(locationItem));
	});

	this.locationList().forEach(function(locationItem){
		var position = locationItem.location();
        var title = locationItem.title();
          // Create a marker per location, and put into markers array.
        var marker = locationItem.marker();
        var fsid = locationItem.fsid();
        locationItem.marker().addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });
    	locationItem.marker().addListener('mouseout', function() {
            this.setIcon(defaultIcon);
          });
    	locationItem.marker().addListener('click', function() {
            populateInfoWindow(this, largeInfowindow, fsid);
          });

        bounds.extend(marker.position);
          // Push the marker to our array of markers.
        markers.push(marker);
      
	});

	map.fitBounds(bounds);

	this.handleLocationClick = function(location){
		populateInfoWindow(location.marker(), largeInfowindow, location.fsid());
	};

	this.handleFilterKeyUp = function(){
		var input, filter, ul, li, a;
    	input = document.getElementById("stationinput");
    	filter = input.value.toUpperCase();
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

 function populateInfoWindow(marker, infowindow, fsid) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          //infowindow.setContent('');
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div><div id="fsinfo"></div>');
          //infowindow.setContent('<div>' + marker.title + '</div>');
          //infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
          var streetViewService = new google.maps.StreetViewService();
          var radius = 50;
           // panorama from that and set the options
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
        });
      }     
