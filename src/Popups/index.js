import { GetUserFriendlyTerminology, fetchWithTimeout } from '../Helpers'

const floodingPopup = (feature, layer) => {

  console.log(layer)
  layer.bindPopup(
    `<div>
      <p class="smbc-body smbc-!-font-color-white">Type of report: ${GetUserFriendlyTerminology(feature.properties.subject_code)}</p>
      <div class="govuk-panel smbc-panel--error govuk-!-padding-1">
        <div class="smbc-panel__body smbc-!-font-color-white">
        A flood has already been reported here
        </div>
      </div>
    </div>`)
}

const reportFloodPopup = async (latlng) => {

  var response = await fetchWithTimeout(`https://spatial.stockport.gov.uk/geoserver/wfs?&service=wfs&version=1.0.0&request=getfeature&typename=address:vw_get_street_names&viewparams=long:${latlng.lng};lat:${latlng.lat};&outputformat=json&nearest_street`)
  const body = await response.json()

  return `<input id="lat" name="lat" type="hidden" value="${latlng.lat}">
          <input id="lng" name="lng" type="hidden" value="${latlng.lng}">
          <input id="street" name="street" type="hidden" value="${body.features[0].properties.nearest_street}">
          <button class="govuk-button govuk-!-margin-bottom-0 govuk-!-margin-top-4" data-module="govuk-button">
            Report a flood
          </button>`
}

export {
  floodingPopup,
  reportFloodPopup
}