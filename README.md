# Neighbourhood-map
This little program is part of my Front-End Nanodegree course at Udacity (2015). 
The goal is to create an easy to use Google Map with some (hardcoded) locations. 

I created three models: MapModel, SidebarModel and a PhotoModel

MAP Model
It adds a Google Map to the canvas. It then proceeds with hardcoded markers onto the map. 
These markers can be clicked on and OnMouseOver on. 

  OnClick: it will open the info window with title and a photo from that location
  OnMouseOver: The marker will bounce... nice...

Sidebar Model
Furthermore there is a search function that uses KNOCKOUT JS. This search function when used will search the location names 
and it will filter not the corresponding names out of the view from the user. Nice and neat.

Photo Model
The Photos are retrieved from Flickr, using its API. The given Parameter is the name of the location

