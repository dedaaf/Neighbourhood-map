
if (typeof google === 'undefined' || google === null) {
  // variable is undefined or null
  console.log('google is null or undefined');
}


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
  },
  {
    locationName: 'Natura Artis Magistra',
    streetName: 'Plantage Kerklaan 38-40',
    zipCode: '1018 CZ',
    City: 'Amsterdam',
    description: 'ZOO',
    Lati: 52.36691,
    Long: 4.91258,

  },
  {
    locationName: 'Amsterdam Roest',
    streetName: 'Jacob Bontiusplaats 1',
    zipCode: '1018 PL',
    City: 'Amsterdam',
    description: 'Cafe & Entertainment',
    Lati: 52.37194,
    Long: 4.92645,

  },
   {
    locationName: 'BurgerMeester',
    streetName: 'Plantage Kerklaan 37',
    zipCode: '1018 CV',
    City: 'Amsterdam',
    description: 'Burger restaur',
    Lati: 52.36662,
    Long: 4.91188,

  },
   {
    locationName: 'Brouwerij \'t IJ',
    streetName: 'Funenkade 7',
    zipCode: '1018 AL',
    city: 'Amsterdam',
    description: 'Brewery',
    Lati: 52.36670,
    Long: 4.92638,

  }
];

var map;//the MAP (outer scope, google likes it that way)

function mapModel(){
  var self = this;
  var marker;
  //the google map centered on my house
  map =  new google.maps.Map(document.getElementById('map'),
                  {
                      center: {lat: 52.37026, lng: 4.92061},
                      zoom: 15
                  }
  );

  self.markerArray = [];
  self.displayAllMarkers = (ko.computed(function(){

    //loop through the marker objects and print their Longitude and Latitude
    for(var i =0; i< locations.length; i++){
      var LatLng = {lat: locations[i].Lati, lng: locations[i].Long};

      marker = new google.maps.Marker({//create the markers
          position: LatLng,
          map: map,
          title: locations[i].locationName
      });
      self.markerArray.push(marker);//store all the beautiful markers in an array



      marker.addListener('click', openWindow(i,marker,LatLng, locations[i].locationName));
    }//end for


  }),self);//end displayAllMarkers

  function openWindow(i, marker,LatLng, locName) {
      return function(){
        var infowindow = new google.maps.InfoWindow({
          content: '<div id="windowTool">'+ randomPhoto(LatLng, locName ) +'</div>'
        });
        infowindow.open(map, marker);
      };
  }


  self.setMapOnAll = function(map){
  // Sets the map on all markers in the array.
    for (var i = 0; i < locations.length; i++) {
      self.markerArray[i].setMap(map);
    }
  };//end setMapOnAll
}//end mapModel

function searchModel(){
  var self = this;

  self.markers = ko.observableArray(locations.slice(0)); //array to hold the locations
  self.query =  ko.observable(''); //oberve the search field
  self.showMap = new mapModel(); //create the map NOW
  self.marker = null;

  //search through the markers in the list
  self.query.subscribe(search = function(value) {
    // remove all the current markers, which removes them from the view
      self.markers.removeAll(); //remove all.. don't worry we will at them below
      self.showMap.setMapOnAll(null); //also remove them from the map

      for(var i=0; i < locations.length; i++) {
        //iterate through the locations to find the query value (the name of the location)
        if(locations[i].locationName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          self.markers.push(locations[i]);

          self.marker = self.showMap.markerArray[i]; //get the marker data from the array in the mapModel
          self.marker.setMap(map); //set the array

          // if(self.markers.length>=3){ //when the user enter 3 characters we are bouncing the marker
          //   marker.setAnimation(google.maps.Animation.BOUNCE); //animate the array...bounce bounce bounce
          // }
        }//end if
      }//end for
    // }//end else
  });//end search



}//end model

var photo_array = [];

//When the users clicks a marker this function is run to display photo's below the map
function randomPhoto(LatLng, locationName){
  var string = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e291a839000711cc0d54015ed9636d6a&jsoncallback=?';
  //var string = 'https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?';

  $.getJSON(string,

    {
      tag: locationName,
      text: locationName,
      tagmode: 'any',
      sort: 'interestingness-desc',
      per_page : 20,
      format: 'json'

    }, function(data){
        for (var i=0; i<data.photos.photo.length; i++){
          var photo = data.photos.photo[i];
          var photo_img = 'https://farm'+ photo.farm +'.staticflickr.com/'+ photo.server +'/'+ photo.id +'_'+ photo.secret +'.jpg'+ '" >';
          $('<img/>').attr('src', photo_img).appendTo('#images');
        }//end for
    }//end function
  );//end JSON
}//end randomPhoto


masterVM = {
  vmMap : new mapModel(),
  vmDisplay : new searchModel(),
//  vmPhoto : new photoModel(),

};

ko.applyBindings(masterVM);
