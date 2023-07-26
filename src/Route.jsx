import axios from 'axios';
import React, { useState } from 'react'
import { createRef } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './component/Header';
const Routes = () => {
  const [routes,setRoutes] = useState([])
  const [routesway,setRoutesway] = useState([])
  const mapRef = createRef()
  const {state} = useLocation();
  const { start, end ,name} = state;

useEffect(() => {
  const H = window.H;


  function calculateRouteFromAtoB(platform) {
    var router = platform.getRoutingService(null, 8),
        routeRequestParams = {
          routingMode: 'fast',
          transportMode: 'car',
          origin: `${start.lat},${start.lng}`, // Brandenburg Gate
          destination: `${end.lat},${end.lng}`, // Friedrichstraße Railway Station
          return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
        };
  
    router.calculateRoute(
      routeRequestParams,
      onSuccess,
      onError
    );
  }
  
  /**
   * This function will be called once the Routing REST API provides a response
   * @param {Object} result A JSONP object representing the calculated route
   *
   * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
   */
  function onSuccess(result) {
    var route = result.routes[0];
  
    /*
     * The styling of the route response on the map is entirely under the developer's control.
     * A representative styling can be found the full JS + HTML code of this example
     * in the functions below:
     */
    setRoutes(route.sections[0].turnByTurnActions)
    setRoutesway(route.sections[0])
    addRouteShapeToMap(route);
    addManueversToMap(route);
    addManueversToPanel(route);
    addSummaryToPanel(route);
    // ... etc.
  }
  
  /**
   * This function will be called if a communication error occurs during the JSON-P request
   * @param {Object} error The error message received.
   */
  function onError(error) {
    alert('Can\'t reach the remote server');
  }
  
  /**
   * Boilerplate map initialization code starts below:
   */
  
  // set up containers for the map + panel
  // var mapContainer = document.getElementById('map'),
  var routeInstructionsContainer = document.getElementById('panel');
  
  // Step 1: initialize communication with the platform
  // In your own code, replace variable window.apikey with your own apikey
  var platform = new H.service.Platform({
    apikey: 'JivHRCsD-7zT9S79FYiWuoNkIX70oux31qtFCsM_EyE'
  });
  
  var defaultLayers = platform.createDefaultLayers();

  // Step 2: initialize a map - this map is centered over Berlin
  var map = new H.Map(mapRef.current,
    defaultLayers.vector.normal.map, {
    center: {lat: start.lat, lng: start.lng},
    zoom: 10,
    pixelRatio: window.devicePixelRatio || 10
  });
 
addMarkersToMap(map)
  // add a resize listener to make sure that the map occupies the whole container
  window.addEventListener('resize', () => map.getViewPort().resize());
  
  // Step 3: make the map interactive
  // MapEvents enables the event system
  // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  
  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);
  
  // Hold a reference to any infobubble opened
  var bubble;
  
  /**
   * Opens/Closes a infobubble
   * @param {H.geo.Point} position The location on the map.
   * @param {String} text          The contents of the infobubble.
   */
  function openBubble(position, text) {
    if (!bubble) {
      bubble = new H.ui.InfoBubble(
        position,
        // The FO property holds the province name.
        {content: text});
      ui.addBubble(bubble);
    } else {
      bubble.setPosition(position);
      bubble.setContent(text);
      bubble.open();
    }
  }
  
  /**
   * Creates a H.map.Polyline from the shape of the route and adds it to the map.
   * @param {Object} route A route as received from the H.service.RoutingService
   */
  function addRouteShapeToMap(route) {
    route.sections.forEach((section) => {
      // decode LineString from the flexible polyline
      let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
  
      // Create a polyline to display the route:
      let polyline = new H.map.Polyline(linestring, {
        style: {
          lineWidth: 4,
          strokeColor: 'rgba(0, 128, 255, 0.7)'
        }
      });
  
      // Add the polyline to the map
      map.addObject(polyline);

      // And zoom to its bounding rectangle
      map.getViewModel().setLookAtData({
        bounds: polyline.getBoundingBox()
      });
    });
  }
  
  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route A route as received from the H.service.RoutingService
   */
  function addManueversToMap(route) {
    var svgMarkup = '<svg width="18" height="18" ' +
      'xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="8" cy="8" r="8" ' +
        'fill="#1b468d" stroke="white" stroke-width="1" />' +
      '</svg>'
      var svgMarkup1 = '<svg width="24" height="24" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<rect stroke="white" fill="#23ac25" x="1" y="1" width="22" ' +
    'height="22" /><text x="12" y="18" font-size="12pt" ' +
    'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
    'fill="white">S</text></svg>'
    var svgMarkup2 = '<svg width="24" height="24" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<rect stroke="white" fill="#23ac25" x="1" y="1" width="22" ' +
    'height="22" /><text x="12" y="18" font-size="12pt" ' +
    'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
    'fill="white">E</text></svg>',
      dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
      dotIcon1 = new H.map.Icon(svgMarkup1, {anchor: {x:8, y:8}}),
      dotIcon2 = new H.map.Icon(svgMarkup2, {anchor: {x:8, y:8}}),
      group = new H.map.Group(),
      i,
      j;
  
    route.sections.forEach((section) => {
      let poly = H.geo.LineString.fromFlexiblePolyline(section.polyline).getLatLngAltArray();
  
      let actions = section.actions;
    
      // Add a marker for each maneuver
      for (i = 1; i < actions.length -1; i += 1) {
        let action = actions[i];
        var marker = new H.map.Marker({
          lat: poly[action.offset * 3],
          lng: poly[action.offset * 3 + 1]},
          {icon: dotIcon});
        marker.instruction = action.instruction;
        group.addObject(marker);
      }
      var marker1 = new H.map.Marker({
        lat: poly[actions[0].offset * 3],
        lng: poly[actions[0].offset * 3 + 1]},
        {icon: dotIcon1});
        marker1.instruction = actions[0].instruction;
        group.addObject(marker1);
        var marker2 = new H.map.Marker({
          lat: poly[actions[actions.length -1].offset * 3],
          lng: poly[actions[actions.length -1].offset * 3 + 1]},
          {icon: dotIcon2});
          marker1.instruction = actions[actions.length -1].instruction;
          group.addObject(marker2);
  
      group.addEventListener('tap', function (evt) {
        map.setCenter(evt.target.getGeometry());
        openBubble(evt.target.getGeometry(), evt.target.instruction);
      }, false);
  
      // Add the maneuvers group to the map
      map.addObject(group);
    });
  }
  
  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route A route as received from the H.service.RoutingService
   */

  
  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route A route as received from the H.service.RoutingService
   */
  function addSummaryToPanel(route) {
    let duration = 0,
      distance = 0;
  
    route.sections.forEach((section) => {
      distance += section.travelSummary.length;
      duration += section.travelSummary.duration;
    });
  
    var summaryDiv = document.createElement('div'),
      content = '<b>Total distance</b>: ' + distance + 'm. <br /><br />' +
        '<b>Travel Time</b>: ' + toMMSS(duration) + ' (in current traffic)';
  
    summaryDiv.style.marginLeft = '5%';
    summaryDiv.style.marginRight = '5%';
    summaryDiv.className = 'directions-1';
    summaryDiv.innerHTML = content;
    routeInstructionsContainer.appendChild(summaryDiv);
  }
  
  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route A route as received from the H.service.RoutingService
   */
  function addManueversToPanel(route) {
    var nodeOL = document.createElement('ol');
  
    nodeOL.style.fontSize = 'small';
    nodeOL.style.marginLeft ='5%';
    nodeOL.style.marginRight ='5%';
    nodeOL.className = 'directions';
  
    route.sections.forEach((section) => {
      section.actions.forEach((action, idx) => {
        var li = document.createElement('li'),
          spanArrow = document.createElement('span'),
          spanInstruction = document.createElement('span');
  
        spanArrow.className = 'arrow ' + (action.direction || '') + action.action;
        spanInstruction.innerHTML = section.actions[idx].instruction;
        li.appendChild(spanArrow);
        li.appendChild(spanInstruction);
  
        nodeOL.appendChild(li);
      });
    });
  
    routeInstructionsContainer.appendChild(nodeOL);
  }

  function toMMSS(duration) {
    return Math.floor(duration / 60) + ' minutes ' + (duration % 60) + ' seconds.';
  }
  
  // Now use the map as required...
  calculateRouteFromAtoB(platform);
  function addMarkersToMap(map) {
    
    navigator.geolocation.getCurrentPosition((position) => {
      const starturl = `https://discover.search.hereapi.com/v1/discover?at=${position.coords.latitude},${position.coords.longitude}&limit=6&lang=en&q=${name}&apiKey=JivHRCsD-7zT9S79FYiWuoNkIX70oux31qtFCsM_EyE`
      axios.get(starturl).then((result) => {
        console.log(result)
        result.data.items.map((item) => {
          var parisMarker = new H.map.Marker({lat:item.position.lat, lng:item.position.lng});
          map.addObject(parisMarker);
        })
      })
    })
    const endurl = `https://discover.search.hereapi.com/v1/discover?at=${end.lat},${end.lng}&limit=6&lang=en&q=${name}&apiKey=JivHRCsD-7zT9S79FYiWuoNkIX70oux31qtFCsM_EyE`
    axios.get(endurl).then((result) => {
      console.log(result)
      result.data.items.map((item) => {
        var parisMarker = new H.map.Marker({lat:item.position.lat, lng:item.position.lng});
        map.addObject(parisMarker);
      })
    })
   
}
 
}, [])
const navigate = useNavigate(); 
const routeBack = () => {
  navigate('/',{ state: false})
}
  return (
   <>
   <Header routeBack={routeBack}/>
   <div className="container-map">
   <div ref={mapRef} id="map"></div>
    <div id="panel">
    <h3>Fastest Car Route {routes && routes[0]?.nextRoad?.name[0].value ? routes[0]?.nextRoad?.name[0].value : " Your Location"} to {routes[routes.length -1]?.currentRoad?.name[0].value ? routes[routes.length -1]?.currentRoad?.name[0].value : ' Destination'}</h3>
    </div>
   </div>
   
   </>

  )
}

export default Routes
