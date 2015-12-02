
if (typeof google === 'undefined' || google === null) {
  // variable is undefined or null
  console.log('google is null or undefined');
}


//different locations hard coded (for now)
var locations = [
  {
    locationName: 'Scheepvaarsmuseum',
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

      self.marker = new google.maps.Marker({
          position: LatLng,
          map: map,
          title: locations[i].locationName
      });
      self.markerArray.push(self.marker);
    }
  }),self);//end displayAllMarkers

  self.setMapOnAll = function(map){
  // Sets the map on all markers in the array.
    for (var i = 0; i < locations.length; i++) {
      self.markerArray[i].setMap(map);


    }
  };//end setMapOnAll
}//end mapModel

function displayModel(){
  var self = this;

  self.markers = ko.observableArray(locations.slice(0)); //array to hold the locations
  self.query =  ko.observable(''); //oberve the search field
  self.showMap = new mapModel(); //create the map NOW

  var marker  ;//variable to hold marker
  //search through the markers in the list
  self.query.subscribe(search = function(value) {
    // remove all the current markers, which removes them from the view
      self.markers.removeAll(); //remove all.. don't worry we will at them below
      self.showMap.setMapOnAll(null); //also remove them from the map

      for(var i=0; i < locations.length; i++) {
        //iterate through the locations to find the query value (the name of the location)
        if(locations[i].locationName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          self.markers.push(locations[i]);

          marker = self.showMap.markerArray[i]; //get the marker data from the array in the mapModel
          marker.setMap(map); //set the array

          // if(self.markers.length>=3){ //when the user enter 3 characters we are bouncing the marker
          //   marker.setAnimation(google.maps.Animation.BOUNCE); //animate the array...bounce bounce bounce
          // }
        }//end if
      }//end for
    // }//end else
  });//end search
}//end model

function photoModel(){
  console.log('test');
    // marker.addListener('click', function(e){
    //   var string = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=84f379a6d6c72598796708ae866b0e5f&tags=scheepsvaartmuseum&format=json&nojsoncallback=1&api_sig=e95b1991861af67e24bf233b9848f748";
    //   $.getJSON(string, function(data) {
    //     // Now use this data to update your view models,
    //     // and Knockout will update your UI automatically
    //     console.log(data);

    //     jsonFlickrApi(data);
    //     function jsonFlickrApi(data){

    //       if (data.stat != "ok"){
    //         // something broke!
    //         return;
    //       }

    //       for (var i=0; i<data.photos.photo.length; i++){

    //         var photo = data.photos.photo[i];

    //         var div = document.createElement('div');
    //         var photo_img = '<img src="'+ 'https://farm'+ photo.farm +'.staticflickr.com/'+ photo.server +'/'+ photo.id +'_'+ photo.secret +'.jpg'+ '" >';

    //         $(div).append(photo_img);
    //         document.body.appendChild(div);
    //       }
    //     }//end jsonFlickrApi
    //   });//end getJSON
    // });//end addListener
}//end getPhoto


masterVM = {
  vmMap : new mapModel(),
  vmDisplay : new displayModel(),
  vmPhoto : new photoModel(),

};

ko.applyBindings(masterVM);
