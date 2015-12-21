/*
 * description Object with different locations from the neighboourhood.
 * description Some variables are added but not used (for now)
 */
var locations = [{
    locationName: 'Scheepvaartmuseum',
    streetName: 'Kattenburgerplein 1',
    zipCode: '1018 KK',
    city: 'Amsterdam',
    description: 'Maritime Museum in Amsterdam',
    Lati: 52.37170,
    Long: 4.91481,
    id: 'Scheepsvaartmuseum'
}, {
    locationName: 'Natura Artis Magistra',
    streetName: 'Plantage Kerklaan 38-40',
    zipCode: '1018 CZ',
    city: 'Amsterdam',
    description: 'Amsterdam Zoo',
    Lati: 52.36691,
    Long: 4.91258,
    id: 'Artis'
}, {
    locationName: 'Amsterdam, Roest',
    streetName: 'Jacob Bontiusplaats 1',
    zipCode: '1018 PL',
    city: 'Amsterdam',
    description: 'Cafe Amsterdam Roest',
    Lati: 52.37194,
    Long: 4.92645,
    id: 'Roest'
}, {
    locationName: 'Restaurant BurgerMeester',
    streetName: 'Plantage Kerklaan 37',
    zipCode: '1018 CV',
    city: 'Amsterdam',
    description: 'Burger bar BurgerMeester',
    Lati: 52.36662,
    Long: 4.91188,
    id: 'BurgerMeester'
}, {
    locationName: 'Brouwerij \'t IJ',
    streetName: 'Funenkade 7',
    zipCode: '1018 AL',
    city: 'Amsterdam',
    description: 'Famous Brewery in Amsterdam',
    Lati: 52.36670,
    Long: 4.92638,
    id: 'Brouwer-t-ij'
}];


//this is the first model
var mapObj = {};

/**
 * @description Initialize the Google Map
 * @param {object} canvasMap - The name of the Google Map
 */
mapObj.initMap = function() {
    var self = this;
    self.canvasMap = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 52.37026,
            lng: 4.92061
        },
        zoom: 15
    });
    $('#map').css('height', '400px'); //overrides Bootstrap settings
    mapObj.createMarkers();
    mapObj.setAllMarkers(self.canvasMap);
    mapObj.createInfoWindow();
};


/**
 * description Create the markers and its definitions
 * description Calculate each marker based on its given Lattitude and Longitude
 * description Also sets each title, description and city name, in this case Amsterdam
 */
mapObj.createMarkers = function() {
    'use strict';

    var self = this;
    self.marker = null;
    self.markerArray = ko.observableArray();

    self.displayAllMarkers = ko.computed(function() {
        //loop through the locations and create markers. The printing will be done later
        for (var i = 0; i < locations.length; i++) {
            var LatLng = {
                lat: locations[i].Lati,
                lng: locations[i].Long
            };
            self.marker = new google.maps.Marker({ //create the markers
                position: LatLng,
                title: locations[i].locationName,
                description: locations[i].description,
                city: locations[i].city,
            });
            self.markerArray.push(self.marker); //store all the beautiful markers in an array

            mapObj.openWindow(self.marker, false);
            mapObj.bounceMarker(self.marker, false);
        } //end for

    }, self); //end displayAllMarkers
};

/**
 * description Takes all the markers from the MarkerArray and puts them onto the map
 * @param {object} - map - Google Map from initMap()
 */
mapObj.setAllMarkers = function(map) {

    for (var i = 0; i < locations.length; i++) {
        this.markerArray()[i].setMap(map);
    }
}; //end setAllMarkers

/** Create a Google Map info (popup) window */
mapObj.createInfoWindow = function() {
    this.infowindow = new google.maps.InfoWindow({
        content: '<div id="windowTool"></div>'
    });
};

/**
 * @description When a list item or marker is clicked (this is checked with @param status) the window will be opened
 * @param {object} marker - Map Marker object
 * @param {boolean} status - Status: Sidebar selection or map selection
 */

mapObj.openWindow = function(marker, status) { //open the GM tooltip
    var self = this;
    //listen to a click and then open the correct window for that marker
    if (status === false) {
        marker.addListener('click', function(markerO) {
            openWin();
        });
    } else {
        openWin();
    }

    /**
     * @description Close an already opened window
     * @description Open a new one base on the name of the map and the specific marker
     * @description Empty everything in the previous window
     * @description Set and show the title and the description
     * @description launch funtion displayPhoto from the photo Model
     */
    function openWin() {
        self.infowindow.close(); //close other infowindows first
        self.infowindow.open(self.canvasMap, marker); //open the window
        $('#windowTool').empty(); //empty everything first
        $('<div class="marker_title"><h4>' + marker.title + '</h4>' +
            '<h5>' + marker.description + '</h5></div>').appendTo('#windowTool'); //now add data
        photoObj.displayPhoto(marker); //get the photos from the internet

    }
};

/**
 * @description Bounce the selected marker. But different models use this so a status check is being done
 * @param {object} marker - Selected Map Marker object
 * @param {boolean} status - Status: Sidebar selection or map selection
 */
mapObj.bounceMarker = function(marker, status) {

    if (status === false) {
        marker.addListener('mouseover', function(markerON) {
            //bounce the marker when mouseover the marker on the map
            bounce(marker);
        });
    } else {
        //bounce the marker when mouseover over the list items
        bounce(marker);
    }

    /**
     * @description Bounce the selected marker.
     * @param {object} marker - Selected Map Marker object
     */
    function bounce(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        //bounce the actual marker and unbounce it after a couple of sec.
        window.setTimeout(function() {
            unbounce(marker);
        }, 2500);
    }
    /**
     * @description Let the bounce of the selected marker STOP
     * @param {object} marker - Selected Map Marker object
     */
    function unbounce(marker) {
        marker.setAnimation(null);
    }
};

/**
 * @description creation of the Sidebar Model
 */
var sidebarObj = {

};

/**
 * @description Initialize the sidebar Model
 */
sidebarObj.init = function() {

    this.places = ko.observableArray(locations.slice(0)); //array to hold the locations
    this.query = ko.observable(''); //oberve the search field

};
sidebarObj.init(); //launch it

/**
 * @description Search function to search through the locations
 * @param {object} marker - Selected Map Marker object
 * @param {boolean} status - Status: Sidebar selection or map selection
 */
//
sidebarObj.searchLoc = function() {
    var self = this;

    /**
     * @description Search function to search through the locations
     * @param {object} value - takes the value from the searchbar
     *
     */
    self.query.subscribe(search = function(value) {
        self.places.removeAll(); // remove all the current places, which removes them from the view
        mapObj.setAllMarkers(null); //also remove the markers from the map

        for (var i = 0; i < locations.length; i++) {
            //iterate through the locations to find the query value (the name of the location)
            if (locations[i].locationName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                self.places.push(locations[i]);

                self.marker = mapObj.markerArray()[i]; //get the marker data from the array in the mapModel
                self.marker.setMap(mapObj.canvasMap); //set the markers back onto the map
            } //end if
        } //end for
        // }//end else
    }); //end search
}; //end sidebarModel

sidebarObj.searchLoc(); //activate the searchLoc function


/**
 * @description When a location in the sidebar is highlighted with the mouse we know what marker corresponds with that name
 * @description Do the mouse over and click (when clicked) and bounce the marker and open a window
 * @param {object} element - @location object
 * @param {jQuery object} domEl - returns if mouse is hovered
 */
sidebarObj.selectLocation = function(element, domEl) { //perform some styling.
    console.log('element', element);
    console.log('domEl', domEl);
    var current = domEl.currentTarget;
    $(current).css('color', '#fff').css('cursor', 'pointer').css('background-color', '#5CB85C');
    //sidebarObj.bounceMarker(element.locationName);
    showMarker(element.locationName);

    //show the marker that is selected based on the location name
    function showMarker(locationName) {
        for (var i = 0; i < mapObj.markerArray().length; i++) {
            if (mapObj.markerArray()[i].title.toLowerCase().indexOf(locationName.toLowerCase()) >= 0) {
                var marker = mapObj.markerArray()[i];
                mapObj.bounceMarker(marker, true);
            }
        }
    }
};

/**
 * @description Undo the selection in the list
 * @param {object} element - @location object
 * @param {jQuery object} domEl - returns if mouse is hoveredd
 */
sidebarObj.selectLocationUndo = function(element, domEl) {
    $(domEl.currentTarget).css('background-color', '#fff').css('color', '#333');
};

/**
 * @description Open the Popup Window for the selected location
 * @param {object} element - @location object
 * @param {jQuery object} domEl - returns if mouse is hoveredd
 */
sidebarObj.openWin = function(element, domEl) {
    var current = domEl.currentTarget;
    for (var i = 0; i < mapObj.markerArray().length; i++) {
        if (mapObj.markerArray()[i].title.toLowerCase().indexOf(element.locationName.toLowerCase()) >= 0) {
            var marker = mapObj.markerArray()[i];

            mapObj.openWindow(marker, true);
        }
    }
};

/**
 * @description When the users clicks a marker this function (or model) is run to display photos below the map
 */
var photoObj = {
    showFlickr: ko.observable(true),
    showGetty: ko.observable(false),
    urls_flickr: ko.observableArray(),
    urls_getty: ko.observableArray(),
    noImg: ko.observable(false),
    errorImg: ko.observable(false),
};


/**
 * @description If there is a location found please go ahead and print the pictures
 * @param { object} [marker] [Google Maps Marker]
 */
photoObj.displayPhoto = function(marker) {
    var locationName = marker.title;

    if (locationName === undefined) {
        return false;
    } else { //only perform action if there is a location set

        photoObj.flickr(marker);
        photoObj.gettyImg(marker);
    }
};

/**
 * @description Retrieve images from Flickr using its API. The search is done base on the title of the marker
 * @param { object} [marker] [Google Maps Marker]
 */
photoObj.flickr = function(marker) {
    var self = this;
    var locationName = marker.title;
    self.urls_flickr([]); //empty array

    $('#flickrPhotos').empty(); //empty all the previous photo's
    var string = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e291a839000711cc0d54015ed9636d6a&jsoncallback=?';
    //var string = 'https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?';


    $.getJSON(string, {
            // tag: locationName,
            text: locationName,
            tagmode: 'any',
            sort: 'interestingness-desc',
            //sort: 'relevance',
            //dc:'title='+locationName,
            has_geo: 1,
            per_page: 20,
            extras: 'description',
            format: 'json'
        },
        function(data) {

            if (data.stat !== 'fail') { //check if there is no failure

                for (var i = 0; i < data.photos.photo.length; i++) {

                    //check if the locationName is in the title && in the description. If so, it's a valid photo
                    var title_check = data.photos.photo[i].title.toLowerCase().indexOf(locationName.toLowerCase());
                    var decript_check = data.photos.photo[i].description._content.indexOf(locationName.toLowerCase());

                    if (title_check || decript_check >= 0) {
                        var photosChecked = data.photos.photo[i];
                        var photoUrl = 'https://farm' + photosChecked.farm + '.staticflickr.com/' + photosChecked.server + '/' + photosChecked.id + '_' + photosChecked.secret + '.jpg' + '" >';
                        //$('<img/>').attr('src', photoIsGo).appendTo('#flickrPhotos');
                        self.urls_flickr.push({
                            url: photoUrl
                        }); //push photos in an array again so that we can use them in the html
                    }
                }

                var randPic = self.urls_flickr()[Math.floor(Math.random() * self.urls_flickr().length)]; //randomizer
                console.log(randPic);
                $('<img/>').attr('src', randPic.url).attr('id', 'picP').appendTo('#windowTool');
            } else {
                photoObj.errorImg(true);
                $('<span class="label label-danger">Error occured retrieving photos</span>').appendTo('#windowTool');
            }
        } //end function


    ); //end JSON

    $(document).ajaxError(function() {
        $('<span class="label label-danger">Error occured retrieving photos</span>').appendTo('#gettyPhotos');
    });

};

/**
 * @description This function retrieves pictures from Getty Images. The search is done first by the name of
 *              the locations defined in the locations object. If the location is not found we will search the
 *              Getty database for City images.
 * @param { object} [marker] [Google Maps Marker]
 */
photoObj.gettyImg = function(marker) {
    var self = this;
    var locName = marker.title;
    var city = marker.city;

    $('#gettyPhotos').empty(); //empty all the previous photo's
    self.urls_getty([]);
    var string_n = 'https://api.gettyimages.com/v3/search/images?phrase=' + locName;

    $.ajax({
        type: 'GET',
        url: string_n,
        headers: {
            'Api-Key': 'vss3dkv8ynztu6zud3wsgeed'
                // more as you need
        },

    }).done(function(data) {

        for (var y = 0; y < data.images.length; y++) {
            var imgG = data.images[y];
            var imgCaption = imgG.caption;

            var imgURL = imgG.display_sizes[0].uri;
            if (imgCaption !== null) {
                if (imgCaption.toLowerCase().indexOf(locName.toLowerCase()) >= 0) {
                    self.urls_getty.push({
                        url: imgURL
                    }); //push all the valid urls in an obervable array
                }
            }
        }

        check_if_pics_found();

        //if there are no pictures found on this API we can return a statement to
        //the user that we will show random city pictures
        function check_if_pics_found() {

            if (self.urls_getty().length === 0) {
                photoObj.noImg(true);
                runSameWithDescription(); //run the same parameters but with the city instead of locationName
            } else {
                photoObj.noImg(false);
            }
        }
    });

    //this function retrieves pictures from the same API but with city search query.
    //Now the user is warned that he/she does not see pics from the location but random
    //pics from this city
    function runSameWithDescription() {
        //get images that contain
        var string_d = 'https://api.gettyimages.com/v3/search/images?phrase=' + city;
        $.ajax({
            type: 'GET',
            url: string_d,
            headers: {
                'Api-Key': 'vss3dkv8ynztu6zud3wsgeed'
                    // more as you need
            },

        }).done(function(data) {
            for (var y = 0; y < data.images.length; y++) {
                var imgG = data.images[y];
                var imgCaption = imgG.caption;
                if (imgCaption !== null) {

                    var imgURL = imgG.display_sizes[0].uri;
                    self.urls_getty.push({
                        url: imgURL
                    });
                }
            }
        });
    }

    //error handeling
    $(document).ajaxError(function() {
        $('<span class="label label-danger">Error occured retrieving photos</span>').appendTo('#gettyPhotos');
    });
};


ko.applyBindings(mapObj, document.getElementById('map'));
ko.applyBindings(sidebarObj, document.getElementById('sidebar'));
