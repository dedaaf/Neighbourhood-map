

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

    var setMapOnAll = function(map){
    // Sets the map on all markers in the array.
      for (var i = 0; i < locations.length; i++) {
        self.markerArray[i].setMap(map);
      }
    };//end setMapOnAll
  }//end mapModel

  function displayModel(){
    var self = this;

    self.markers = ko.observableArray(locations.slice(0));
    self.query =  ko.observable('');


    self.showMap = new mapModel();

    //search through the markers in the list
    self.query.subscribe(search = function(value) {

      console.log(mapModel.setMapOnAll);
      //mapModel.setMapOnAll(null);



      // remove all the current markers, which removes them from the view
      self.markers.removeAll();

      for(var i=0; i < locations.length; i++) {
       //iterate through the locations to find the query value (the name of the location)
        if(locations[i].locationName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          self.markers.push(locations[i]);
        }
        else
          //iterate through the locations to find the query value (description in this case)
        if(locations[i].description.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
           self.markers.push(locations[i]);
        }
      }
    });//end search

  }//end model


ko.applyBindings(new displayModel());


// Activates knockout.js

//  ko.applyBindings(locationDisplay);

//function to determine the amount of markers
//
//
//
//
////search through markers and filter them in a list
