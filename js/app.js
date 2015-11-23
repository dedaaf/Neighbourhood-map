if (typeof google === 'undefined' || google === null) {
    // variable is undefined or null
    console.log('google is null or undefined');
}


//display map
function mapModel() {
  var self = this;

  self.map =  new google.maps.Map(document.getElementById('map'),
                {
                    center: {lat: 52.37026, lng: 4.92061},
                    zoom: 15
                }
  );
    //determine the markers in the neighbourhood
  self.locations = [
    {
      locationName: 'Scheepvaarsmuseum',
      streetName: 'Kattenburgerplein 1',
      zipCode: '1018 KK',
      City: 'Amsterdam',
      Description: 'Museum about boats and stuff',
      Lati: 52.37170,
      Long: 4.91481,
    },
    {
      locationName: 'Natura Artis Magistra',
      streetName: 'Plantage Kerklaan 38-40',
      zipCode: '1018 CZ',
      City: 'Amsterdam',
      Description: 'ZOO',
      Lati: 52.36691,
      Long: 4.91258,

    },
    {
      locationName: 'Amsterdam Roest',
      streetName: 'Jacob Bontiusplaats 1',
      zipCode: '1018 PL',
      City: 'Amsterdam',
      Description: 'Cafe & Entertainment',
      Lati: 52.37194,
      Long: 4.92645,

    },
     {
      locationName: 'BurgerMeester',
      streetName: 'Plantage Kerklaan 37',
      zipCode: '1018 CV',
      City: 'Amsterdam',
      Description: 'Burger restaur',
      Lati: 52.36662,
      Long: 4.91188,

    },
     {
      locationName: 'Brouwerij \'t IJ',
      streetName: 'Funenkade 7',
      zipCode: '1018 AL',
      City: 'Amsterdam',
      Description: 'Brewery',
      Lati: 52.36670,
      Long: 4.92638,

    }
  ];

   //function to display markers of locations
  self.displayMarkers = ko.computed(function(){

    //loop through the marker objects and print their Longitude and Latitude
    for(var i =0; i< self.locations.length; i++){
      var LatLng = {lat: self.locations[i].Lati, lng: self.locations[i].Long};

      this.marker = new google.maps.Marker({
          position: LatLng,
          map: self.map,
        });
      }
  },self);


}


// Activates knockout.js
ko.applyBindings(new mapModel());

//function to determine the amount of markers
//
//
//
//
////search through markers and filter them in a list
