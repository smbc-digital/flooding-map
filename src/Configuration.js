import Leaflet from 'leaflet'
import { floodingPopup } from './Popups'

const Configuration = {
  Map: {
    StartingLatLng: [53.3915, -2.125143],
    StartingZoom: 12,
    FullscreenControl: true,
    DisplayLayerControls: true,
    DisplayGrayScale: true,
    DisplayStreets: true,
    EnableAddressSearch: true,
    EnableLocateControl: true
  },
  DynamicData: [
    {
      key: 'Flooding Layer',
      url:
        'https://spatial.stockport.gov.uk/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=flooding:flood_incidents_live&outputFormat=application/json&bbox={0},EPSG:4326&srsName=EPSG:4326',
      layerOptions: {
        onEachFeature: floodingPopup,
        maxZoom: 16,
        pointToLayer: (feature, latlng) => {
          const svg = '<svg height="20pt" viewBox="0 0 45 39" width="20pt" xmlns="http://www.w3.org/2000/svg"><path d="m3.333773,36.37534l19.333429,-32.696187l19.333431,32.696187z" stroke-width="3.5" stroke="#000" fill="#c83725"/></svg>'
          const url = encodeURI('data:image/svg+xml,' + svg).replace(/#/g, '%23')
          return Leaflet.marker(latlng, {
            icon: new Leaflet.Icon({
              iconUrl: url,
              iconSize: [31, 31],
              iconAnchor: [16, 4]
            })
          })
        }
      },
      displayOverlay: true,
      visibleByDefault: true
    }
  ],
  StaticData: [
    {
      key: 'boundary',
      url:
        'https://spatialgeojson.s3-eu-west-1.amazonaws.com/webmapping/boundary.geojson',
      layerOptions: {
        interactive: false,
        maxZoom: 9,
        style: {
          color: '#000',
          weight: 4,
          opacity: 1,
          fillColor: '#000',
          fillOpacity: 0
        }
      }
    }
  ]
}

export default Configuration
