import React, { useRef, useEffect, useState } from 'react'
import Leaflet from 'leaflet'
import { fetchWithTimeout } from './Helpers'
import Config from './Configuration.js'
import { os_open } from './Tiles'
import { AddLayerControlsLayers, AddLayerControlsOverlays, SearchControlOverlay } from './Controls'
import leafletPip from '@mapbox/leaflet-pip'
import locate from 'leaflet.locatecontrol'  // eslint-disable-line no-unused-vars

function App() {
  const mapRef = useRef()

  const StaticLayerGroup = {}
  const WMSLayerGroup = {}
  const DynamicLayerGroup = Config.DynamicData.reduce((accumulator, currentValue) => {
    accumulator[currentValue.key] = new Leaflet.FeatureGroup()
    return accumulator
  }, {})

  useEffect(() => {
    mapRef.current = Leaflet.map('map', {
      preferCanvas: true,
      minZoom: 12,
      fullscreenControl: Config.Map.FullscreenControl || false,
      layers: [
        os_open
      ]
    }).setView(Config.Map.StartingLatLng || [53.413519, -2.085143], Config.Map.StartingZoom || 12)

    setStaticLayers()
    setDynamicLayers()
    setLayerControls()
    setLocateControl()
  }, [])

  const setLocateControl = () => {
    if (Config.Map.EnableLocateControl) {
      Leaflet.control.locate().addTo(mapRef.current) 
    }
  }

  const setLayerControls = () => {
    const controlLayers = AddLayerControlsLayers(Config.Map)
    const overlays = AddLayerControlsOverlays(Config, DynamicLayerGroup, WMSLayerGroup, mapRef.current)

    if (Config.Map.DisplayLayerControls) {
      Leaflet.control
        .layers(controlLayers, overlays)
        .addTo(mapRef.current)
    }

    if (Config.Map.EnableAddressSearch){
      mapRef.current.addControl(SearchControlOverlay())
      let searchButtonRefs = document.querySelector('.leaflet-control-search .search-button')
      searchButtonRefs.click()
    }
  }

  const setDynamicLayers = async () => {
    const layers = {}
    await Promise.all(Config.DynamicData.map(async (layer) => {
      if (layer.url.endsWith('wms?')) {
        WMSLayerGroup[layer.key] = layer
      } else {
        const url = layer.url.replace('{0}', mapRef.current.getBounds().toBBoxString())
        const newLayer = await fetchData(url, layer.layerOptions)
        layers[layer.key] = newLayer
      }
    }))

    Object.keys(DynamicLayerGroup).map((layer) => {
      DynamicLayerGroup[layer].clearLayers()
      if (layers[layer] !== undefined && layers[layer] !== null) {
        DynamicLayerGroup[layer].addLayer(layers[layer])
      }
    })
  }

  const setStaticLayers = async () => {
    const layers = {}
    await Promise.all(Config.StaticData.map(async (layer) => {
      const newLayer = await fetchData(layer.url, layer.layerOptions)
      layers[layer.key] = newLayer
    }))

    Config.StaticData.map((layer) => {
      if (layers[layer.key] !== null) {
        StaticLayerGroup[layer.key] = new Leaflet.FeatureGroup()
        StaticLayerGroup[layer.key].addLayer(layers[layer.key]).addTo(mapRef.current)
      }
    })
  }

  useEffect(() => {
    mapRef.current.addEventListener('moveend', setDynamicLayers)

    return () =>  mapRef.current.removeEventListener('moveend', setDynamicLayers)
  }, [])

  const [onClickLatLng, setOnClickLatLng] = useState()
  useEffect(() => {
    if(!onClickLatLng) return

    const polygonsFoundInMap = leafletPip.pointInLayer(onClickLatLng, mapRef.current)

    const layerContentInMap = polygonsFoundInMap
      .filter(_ => _.feature && _._popup && _._popup._content)
      .reduce((acc, curr, index, src) => {
        return `${acc} ${curr._popup._content} ${index != src.length - 1 ? '<hr/>' : ''}`
      }, '')

    /** opens new popup with new content and binds to map, this is instead of using 
     * mapRef.current._popup.setConent as the popup is bound to the layer and not 
     * the map and will therefore close when you move the map */
    if (layerContentInMap) {
      Leaflet.popup()
        .setLatLng(onClickLatLng)
        .setContent(layerContentInMap)
        .openOn(mapRef.current)
    } else {
      Leaflet.popup()
        .setLatLng(onClickLatLng)
        .setContent(mapRef.current._popup._content)
        .openOn(mapRef.current)
    }

    panMap(onClickLatLng)

  }, [onClickLatLng])

  const panMap = latLng => {
    var px = mapRef.current.project(latLng)
    px.y -= mapRef.current._popup._container.clientHeight/2
    mapRef.current.panTo(mapRef.current.unproject(px),{animate: true})
  }

  const onPopupOpenHandler = event =>  setOnClickLatLng(event.popup._latlng)
  
  useEffect(() => {
    mapRef.current.addEventListener('popupopen', onPopupOpenHandler)

    return () => mapRef.current.removeEventListener('popupopen', onPopupOpenHandler)
  }, [])

  const fetchData = async (url, layerOptions) => {
    if (mapRef.current.getZoom() > layerOptions.maxZoom) {
      const response = await fetchWithTimeout(url)
      const body = await response.json()
      return Leaflet.geoJson(body, layerOptions)
    }
    return null
  }

  return (
    <div id="map" />
  )
}

export default App