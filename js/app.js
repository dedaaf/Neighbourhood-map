//different locations hard coded (for now)
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

//the google map centered on my house
var canvasMap =  new google.maps.Map(document.getElementById('map'),
                  {
                      center: {lat: 52.37026, lng: 4.92061},
                      zoom: 15
                  }
  );

var windowOpen =false; //check if window is open.

function mapModel(){//model to display the markers on the map and to handle animation
  var self = this;
  self.marker = null;

  self.markerArray = [];
  self.displayAllMarkers = ko.computed(function(){
  self.infowindow = new google.maps.InfoWindow({
    content: '<div id="windowTool"></div>'
  });
    //loop through the marker objects and print their Longitude and Latitude
    for(var i =0; i< locations.length; i++){
      var LatLng = {lat: locations[i].Lati, lng: locations[i].Long};

       self.marker = new google.maps.Marker({//create the markers
          position: LatLng,
          title: locations[i].locationName
      });

      self.markerArray.push( self.marker);//store all the beautiful markers in an array

      self.marker.addListener('click', openWindow(self.marker));
      self.marker.addListener('mouseover', bounceMarker(self.marker.title));



    }//end for
  }, self);//end displayAllMarkers

  self.setAllMarkers = function(map){
  // Sets the map on all markers in the array.
    for (var i = 0; i < locations.length; i++) {
      self.markerArray[i].setMap(map);
    }
  };//end setAllMarkers


  function openWindow(marker) { //open the GM tooltip

    return function(){
      $('#photos').empty();
      self.infowindow.close();//close other infowindows first
      self.infowindow.open(canvasMap, marker); //open the window
      $('#windowTool').empty(); //empty everything first
      $('<div class="marker_title">'+marker.title+'</div>').appendTo('#windowTool'); //now add data
      photoModel(marker.title); //get the photos from the internet

    };
  }

  function bounceMarker (markerName) {
     return function(){
      for(var i=0; i < self.markerArray.length;i++){
        if(self.markerArray[i].title.toLowerCase().indexOf(markerName.toLowerCase()) >= 0) {
          self.markerArray[i].setAnimation(google.maps.Animation.BOUNCE);
        }else{
          self.markerArray[i].setAnimation(null);
        }
      }
    };
  }
}//end model

function sidebarModel(){ //model to handle search queries
   var self = this;

  self.places = ko.observableArray(locations.slice(0)); //array to hold the locations
  self.query =  ko.observable(''); //oberve the search field

  self.mapMdl = new mapModel();
  self.mapMdl.setAllMarkers(canvasMap);//set all the markers on the map

  //search through the markers in the list
  self.query.subscribe(search = function(value) {
    self.places.removeAll(); // remove all the current places, which removes them from the view
    self.mapMdl.setAllMarkers(null); //also remove the markers from the map

      for(var i=0; i < locations.length; i++) {
        //iterate through the locations to find the query value (the name of the location)
        if(locations[i].locationName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          self.places.push(locations[i]);

          self.marker = self.mapMdl.markerArray[i]; //get the marker data from the array in the mapModel
          self.marker.setMap(canvasMap); //set the array
        }//end if


      }//end for
    // }//end else
  });//end search

  selectLocationStyle = function(element, domEl){
       $(domEl.currentTarget).css('color', 'red');
       bounceMarker(element.locationName);
  };
  selectLocationUndo = function(element, domEl){
     $(domEl.currentTarget).css('color', 'black');
     bounceMarker(element.locationName);

  };

 function bounceMarker (markerName) {

      for(var i=0; i < self.mapMdl.markerArray.length;i++){
        if(self.mapMdl.markerArray[i].title.toLowerCase().indexOf(markerName.toLowerCase()) >= 0) {
          self.mapMdl.markerArray[i].setAnimation(google.maps.Animation.BOUNCE);
        }else{
          self.mapMdl.markerArray[i].setAnimation(null);
        }
      }
  }



}//end sidebarModel

//When the users clicks a marker this function is run to display photo's below the map
function photoModel(locationName){

  if (locationName !== undefined){ //only perform action if there is a location set
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
        format: 'json'

      },
      function(data){

        if (data.stat !== 'fail'){//check if there is no failure
          var firstPhoto = data.photos.photo[0];
          var firstPhoto_img = 'https://farm'+ firstPhoto.farm +'.staticflickr.com/'+ firstPhoto.server +'/'+ firstPhoto.id +'_'+ firstPhoto.secret +'.jpg'+ '" >';
          $('<img/>').attr('src', firstPhoto_img).attr('id', 'picP').appendTo('#windowTool');


          for (var i=0; i<data.photos.photo.length; i++){
            var randomPhoto = data.photos.photo[i];
            var rand_photo_img = 'https://farm'+ randomPhoto.farm +'.staticflickr.com/'+ randomPhoto.server +'/'+ randomPhoto.id +'_'+ randomPhoto.secret +'.jpg'+ '" >';
            $('<img/>').attr('src', rand_photo_img).appendTo('#photos');
          }//end for
        }//end if
      }//end function
    );//end JSON
  }

}//end randomPhoto

ko.applyBindings(mapModel, document.getElementById('map'));
ko.applyBindings(sidebarModel, document.getElementById('sidebar'));
ko.applyBindings(photoModel, document.getElementById('photos'));


//function to override bootstrap height values
$(window).resize(function () {
    var h = $(window).height(),
        offsetTop = 320; // Calculate the top offset

    $('#map').css('height', (h - offsetTop));
}).resize();
