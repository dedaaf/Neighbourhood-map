# Neighbourhood-map
This little program is part of my Front-End Nanodegree course at Udacity (2015).
The goal is to create an easy to use Google Map with some (hardcoded) locations.

I created three models: MapModel, SidebarModel and a PhotoModel

MAP Model
It adds a Google Map to the canvas. It then proceeds to create markers with hardcoded locations onto the map.
These markers can be clicked on and OnMouseOver on.

  OnClick: it will open the info window with title and a photo from that location
  OnMouseOver: The marker will bounce... nice...

Sidebar Model
Furthermore there is a search function that uses KNOCKOUT JS. This search function when used will search the location names
and it will filter not the corresponding names out of the view from the user. Nice and neat.

When the user uses his mouse here to will generate the markers to bounce, also color is changed.

Photo Model
The Photos are retrieved from Flickr, using its API. The given Parameter is the name of the location

& And now also from Getty Images. Check it out.


How to use it:

1. Use your mouse to select a location from the list.
2. Or click the marker on the map.
3. A window (tooltip) will be seen with the name of the location and a random picture
4. On the bottom a set of pictures (if available) will be shown.
5. You can choose the source of the images (Flickr or Getty Images) by pressing one of the buttons on top
6. If you need to search for a location use the searchbar

