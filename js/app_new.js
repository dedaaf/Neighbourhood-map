var locations = [
  {
    locationName: 'Scheepsvaartmuseum',
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
    locationName: 'Amsterdam Roest',
    streetName: 'Jacob Bontiusplaats 1',
    zipCode: '1018 PL',
    City: 'Amsterdam',
    description: 'Cafe & Entertainment',
    Lati: 52.37194,
    Long: 4.92645,
    id: 'Roest'
  },
   {
    locationName: 'BurgerMeester',
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
                title: locations[i].locationName
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
    var self = this;
     return function(){
      for(var i=0; i < self.markerArray.length;i++){
        if(self.markerArray[i].title.toLowerCase().indexOf(markerName.toLowerCase()) >= 0) {
          self.markerArray[i].setAnimation(google.maps.Animation.BOUNCE);
        }else{
          self.markerArray[i].setAnimation(null);
        }
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

  //self.mapMdl = new mapModel();
  //self.mapMdl.setAllMarkers(canvasMap);//set all the markers on the map

  //search through the markers in the list

};//end sidebarModel
sidebarObj.searchLoc();

sidebarObj.selectLocationStyle = function(element, domEl){
    $(domEl.currentTarget).css('color', 'red');
    $(domEl.currentTarget).css( 'cursor', 'pointer' );
    sidebarObj.bounceMarker(element.locationName);
};

sidebarObj.selectLocationUndo = function(element, domEl){
     $(domEl.currentTarget).css('color', 'black');
     sidebarObj.bounceMarker(element.locationName);
};

sidebarObj.bounceMarker = function(markerName) {

    for(var i=0; i < mapObj.markerArray.length;i++){
        if(mapObj.markerArray[i].title.toLowerCase().indexOf(markerName.toLowerCase()) >= 0) {
            mapObj.markerArray[i].setAnimation(google.maps.Animation.BOUNCE);
        }else{
            mapObj.markerArray[i].setAnimation(null);
        }
    }
};

//When the users clicks a marker this function is run to display photo's below the map
var photoObj = {};

photoObj.displayPhoto = function (locationName){
    var self = this;
    $('#photosShow').empty(); //empty all the previous photo's

    if (locationName === undefined){
       return false;
    }else{//only perform action if there is a location set

            photoObj.flickr(locationName);

        }
};


photoObj.flickr = function(locationName){
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
        //per_page : 20,
        extras: 'description',
        format: 'json'
        },
        function(data){
            console.log(data);
            if (data.stat !== 'fail'){//check if there is no failure

              var photoWithTitle ;
              var title_in_photo_img;
              var picsArray = [];

              for (var i=0; i<data.photos.photo.length; i++){
               if(  data.photos.photo[i].title.toLowerCase().indexOf( locationName.toLowerCase() ) >= 0 ){
                  photoWithTitle = data.photos.photo[i];
                  title_in_photo_img = 'https://farm'+ photoWithTitle.farm +'.staticflickr.com/'+ photoWithTitle.server +'/'+ photoWithTitle.id +'_'+ photoWithTitle.secret +'.jpg'+ '" >';
                  $('<img/>').attr('src', title_in_photo_img).appendTo('#photosShow');

                  picsArray.push(photoWithTitle);
                }
              }

              console.log(picsArray);
              for(var y=0; y<picsArray.length; y++){
                if( picsArray[y].title.toLowerCase() == locationName.toLowerCase() ){
                  var photoWindow = picsArray[y];
                  var firstPhoto_img = 'https://farm'+ photoWindow.farm +'.staticflickr.com/'+ photoWindow.server +'/'+ photoWindow.id +'_'+ photoWindow.secret +'.jpg'+ '" >';
                  return $('<img/>').attr('src', firstPhoto_img).attr('id', 'picP').appendTo('#windowTool');
                }
              }
            }//end fail check
        }//end function
    );//end JSON
};

photoObj.gettyImg = function(){

};

ko.applyBindings(mapObj, document.getElementById('map'));
ko.applyBindings(sidebarObj, document.getElementById('sidebar'));
ko.applyBindings(photoObj, document.getElementById('photosShow'));
