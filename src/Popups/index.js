import { GetUserFriendlyTerminology } from '../Helpers'

const floodingPopup = (feature, layer) => {
  layer.bindPopup(
    `<div>
      <p>Type of report: ${GetUserFriendlyTerminology(feature.properties.subject_code)}</p>
      <button class="govuk-button govuk-button--warning govuk-!-margin-bottom-0" data-module="govuk-button">
        A flood has already been reported here
      </button>
    </div>`)
}

const reportFloodPopup = (latlng) => {
  return `<input id="lat" name="lat" type="hidden" value="${latlng.lat}">
          <input id="lng" name="lng" type="hidden" value="${latlng.lng}">
          <button class="govuk-button govuk-!-margin-bottom-0 govuk-!-margin-top-4" data-module="govuk-button">
            Report a flood
          </button>`
}

export {
  floodingPopup,
  reportFloodPopup
}