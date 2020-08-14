import { GetUserFriendlyTerminology } from '../Helpers'

const floodingPopup = (feature, layer) => {
  let noOfDays = Math.floor(
    (new Date() - new Date(feature.properties.enquiry_time)) /
    (1000 * 3600 * 24)
  )

  layer.bindPopup(
    `<div>
      <p>Type of report: ${GetUserFriendlyTerminology(feature.properties.subject_code)}</p>
      <button class="govuk-button govuk-button--warning govuk-!-margin-bottom-0" data-module="govuk-button">
        A flood has already been reported here
      </button>
    </div>`)
}

const reportFloodPopup = (latLng) => {
  return `<button class="govuk-button govuk-!-margin-bottom-0 govuk-!-margin-top-4" data-module="govuk-button">
            Report a flood
          </button>`
}

export {
  floodingPopup,
  reportFloodPopup
}