var locations = [
  {
    locationName: 'Scheepvaartmuseum',
    streetName: 'Kattenburgerplein 1',
    zipCode: '1018 KK',
    City: 'Amsterdam',
    description: 'Museum about boats and stuff',
    Lati: 52.37170,
    Long: 4.91481,
    id: 'Scheepsvaartmuseum'
  },
  {
    locationName: 'Natura Artis Magistra',
    streetName: 'Plantage Kerklaan 38-40',
    zipCode: '1018 CZ',
    City: 'Amsterdam',
    description: 'ZOO',
    Lati: 52.36691,
    Long: 4.91258,
    id: 'Artis'
  },
  {
    locationName: 'Amsterdam, Roest',
    streetName: 'Jacob Bontiusplaats 1',
    zipCode: '1018 PL',
    City: 'Amsterdam',
    description: 'Cafe & Entertainment',
    Lati: 52.37194,
    Long: 4.92645,
    id: 'Roest'
  },
   {
    locationName: 'Restaurant BurgerMeester',
    streetName: 'Plantage Kerklaan 37',
    zipCode: '1018 CV',
    City: 'Amsterdam',
    description: 'Burger restaur',
    Lati: 52.36662,
    Long: 4.91188,
    id: 'BurgerMeester'
  },
   {
    locationName: 'Brouwerij \'t IJ',
    streetName: 'Funenkade 7',
    zipCode: '1018 AL',
    city: 'Amsterdam',
    description: 'Brewery',
    Lati: 52.36670,
    Long: 4.92638,
    id: 'Brouwer-t-ij'
  }
];


var mapObj ={};
//the google map centered on my house
mapObj.initMap = function(){
    var self = this;
    self.canvasMap =  new google.maps.Map(document.getElementById('map'),
              {
                center: {lat: 52.37026, lng: 4.92061},
                zoom: 15
              }
  );
    $('#map').css('height', '400px');
    mapObj.createMarkers();
    mapObj.setAllMarkers( self.canvasMap);
    mapObj.createInfoWindow();
};

mapObj.createMarkers = function(){

    var self = this;
    self.marker = null;
    self.markerArray = [];

    self.displayAllMarkers = ko.computed(function(){
    //loop through the locations and create markers. The printing will be done later
        for(var i =0; i< locations.length; i++){
            var LatLng = {lat: locations[i].Lati, lng: locations[i].Long};
            self.marker = new google.maps.Marker({//create the markers
                position: LatLng,
                title: locations[i].locationName,
                description: locations[i].description
            });
            self.markerArray.push( self.marker);//store all the beautiful markers in an array
            self.marker.addListener('click', mapObj.openWindow(self.marker));
            self.marker.addListener('mouseover', mapObj.bounceMarker(self.marker.title));
        }//end for

    }, self);//end displayAllMarkers


};

mapObj.setAllMarkers = function(map){
    // Set all markers in that we have in the markerArray.
    // But sometimes this can be empty...hence the opportunity to insert an
    for (var i = 0; i < locations.length; i++) {
        this.markerArray[i].setMap(map);
    }
};//end setAllMarkers

mapObj.createInfoWindow = function(){
    this.infowindow = new google.maps.InfoWindow({
        content: '<div id="windowTool"></div>'
    });
};



mapObj.openWindow = function(marker) { //open the GM tooltip
    var self = this;
    return function(){

      self.infowindow.close();//close other infowindows first
      self.infowindow.open(self.canvasMap, marker); //open the window
      $('#windowTool').empty(); //empty everything first
      $('<div class="marker_title">'+marker.title+'</div>').appendTo('#windowTool'); //now add data
      photoObj.displayPhoto(marker.title); //get the photos from the internet

    };
};

mapObj.bounceMarker = function(markerName) {
    //bounce the marker. Return statement is used. to select the correct marker
    var self = this;
    return function(){
        for(var i=0; i < self.markerArray.length;i++){
            if(self.markerArray[i].title.toLowerCase().indexOf(markerName.toLowerCase()) >= 0) {
                bounce(self.markerArray[i]);
            }else{
                unbounce(self.markerArray[i]);

            }
        }
        function bounce(marker){
            marker.setAnimation(google.maps.Animation.BOUNCE);
            //bounce the actual marker and unbounce it after a couple of sec.
            window.setTimeout(function(){
                unbounce(marker);
            }, 2500);
        }
        function unbounce(marker){
            marker.setAnimation(null);
        }
    };
};

var sidebarObj ={

};

sidebarObj.init = function(){
    var self = this;

    this.places = ko.observableArray(locations.slice(0)); //array to hold the locations
    this.query =  ko.observable(''); //oberve the search field

};
sidebarObj.init();

sidebarObj.searchLoc = function(){ //model to handle search queries
    var self = this;
    self.query.subscribe(search = function(value) {
    self.places.removeAll(); // remove all the current places, which removes them from the view
    mapObj.setAllMarkers(null); //also remove the markers from the map

      for(var i=0; i < locations.length; i++) {
        //iterate through the locations to find the query value (the name of the location)
        if(locations[i].locationName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          self.places.push(locations[i]);

          self.marker = mapObj.markerArray[i]; //get the marker data from the array in the mapModel
          self.marker.setMap(mapObj.canvasMap); //set the array
        }//end if


      }//end for
    // }//end else
  });//end search
};//end sidebarModel

sidebarObj.searchLoc(); //activate the searchLoc function

sidebarObj.selectLocationStyle = function(element, domEl){ //perform some styling.
    var current = domEl.currentTarget;
    $(current).css('color', 'red');
    $(current).css( 'cursor', 'pointer' );
    sidebarObj.bounceMarker(element.locationName);

    $( current ).click(function() {
        sidebarObj.checkMarker(element.locationName);
    });

};

sidebarObj.selectLocationUndo = function(element, domEl){
     $(domEl.currentTarget).css('color', 'black');
     sidebarObj.bounceMarker(element.locationName);
};

sidebarObj.checkMarker = function(locationName){
    var locName = locationName;
     for(var i=0; i < mapObj.markerArray.length;i++){
        if( mapObj.markerArray[i].title.toLowerCase().indexOf(locName.toLowerCase() ) >= 0) {

             sidebarObj.openWindow(mapObj.markerArray[i]);
             //console.log(mapObj.markerArray[i]);

        }
    }
};

sidebarObj.openWindow = function(marker) { //open the GM tooltip
    var map = mapObj;

    map.infowindow.close();//close other infowindows first
    map.infowindow.open(map.canvasMap, marker); //open the window
     $('#windowTool').remove('img');
    $('<div class="marker_title">'+marker.title+'</div>').appendTo('#windowTool'); //now add data
    photoObj.displayPhoto(marker.title); //get the photos from the internet
};

sidebarObj.bounceMarker = function(markerName) { //bounce marker if the user hovers over the name
    for(var i=0; i < mapObj.markerArray.length;i++){
        if(mapObj.markerArray[i].title.toLowerCase().indexOf(markerName.toLowerCase()) >= 0) {
             bounce(mapObj.markerArray[i]);
        }else{
            unbounce(mapObj.markerArray[i]);
        }
    }
    function bounce(marker){ //animate the marker using googles functions. Also unbounce after a couple of sec
        marker.setAnimation(google.maps.Animation.BOUNCE);
        window.setTimeout(function(){
            unbounce(marker);
        }, 2500);
    }
    function unbounce(marker){
        marker.setAnimation(null);
    }
};

//When the users clicks a marker this function is run to display photo's below the map
var photoObj = {
    showFlickr: ko.observable(true),
    showGetty: ko.observable(false),
};

photoObj.displayPhoto = function (locationName){

    if (locationName === undefined){
       return false;
    }
    else{//only perform action if there is a location set

        var picsArray = photoObj.flickr(locationName);
        return picsArray;
        //photoObj.gettyImg(locationName);

        }
};


//
photoObj.flickr = function(locationName){
    $('#flickrPhotos').empty(); //empty all the previous photo's
    var string = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e291a839000711cc0d54015ed9636d6a&jsoncallback=?';
        //var string = 'https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?';
    var data;

    $.getJSON(string,
        {
        // tag: locationName,
        text: locationName,
        tagmode: 'any',
        sort: 'interestingness-desc',
        //sort: 'relevance',
        //dc:'title='+locationName,
        has_geo: 1,
        per_page : 20,
        extras: 'description',
        format: 'json'
        },
        function(data){
            if (data.stat !== 'fail'){//check if there is no failure

                var picsArray = [];
                for(var i =0; i< data.photos.photo.length;i++){

                    //check if the locationName is in the title && in the description. If so, it's a valid photo
                    var title_check =  data.photos.photo[i].title.toLowerCase().indexOf( locationName.toLowerCase() );
                    var decript_check = data.photos.photo[i].description._content.indexOf( locationName.toLowerCase() ) ;

                    if(title_check || decript_check >=0){
                        var photosChecked = data.photos.photo[i];
                           var photoIsGo = 'https://farm'+ photosChecked.farm +'.staticflickr.com/'+ photosChecked.server +'/'+ photosChecked.id +'_'+ photosChecked.secret +'.jpg'+ '" >';
                        $('<img/>').attr('src', photoIsGo).appendTo('#flickrPhotos');
                        picsArray.push(photosChecked);//push photos in an array again so that we can pick them below

                    }
                }
                var photoWithTitle ;
                var title_in_photo_img;
                var randPic = picsArray[Math.floor(Math.random() * picsArray.length)];//randomizer
                var phto_win = randPic;
                var firstPhoto_img = 'https://farm'+ phto_win.farm +'.staticflickr.com/'+ phto_win.server +'/'+ phto_win.id +'_'+ phto_win.secret +'.jpg'+ '" >';
                $('<img/>').attr('src', firstPhoto_img).attr('id', 'picP').appendTo('#windowTool');
            }//end fail check
        }//end function
    );//end JSON
};

photoObj.gettyImg = function(locationName){
    $('#gettyPhotos').empty(); //empty all the previous photo's
    var locName = locationName.toLowerCase();

    var string = "https://api.gettyimages.com/v3/search/images?phrase="+locName;

    $.ajax({
      type: 'GET',
      url: string,
      headers: {
        "Api-Key":"vss3dkv8ynztu6zud3wsgeed"
        // more as you need
      },

    }).done(function( data ) {

        for(var y=0; y< data.images.length;y++){
            var imgG =data.images[y];
            var imgCaption = imgG.caption;

            if(imgCaption !==null){
                if( imgCaption.indexOf( locationName) >= 0 ){
                    var imgGetty = data.images[y];
                    var imgURL= imgGetty.display_sizes[0].uri;

                    // var imgString = "https://api.gettyimages.com:443/v3/images/"+imgIds;
                    $('<img/>').attr('src', imgURL).attr('id', 'gettyIMG').appendTo('#gettyPhotos');
                }
            }
        }
  });
};


ko.applyBindings(mapObj, document.getElementById('map'));
ko.applyBindings(sidebarObj, document.getElementById('sidebar'));
//ko.applyBindings(photoObj, document.getElementById('photos'));
