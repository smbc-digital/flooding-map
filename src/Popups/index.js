const floodingPopup = (feature, layer) => {
  let noOfDays = Math.floor(
    (new Date() - new Date(feature.properties.enquiry_time)) /
      (1000 * 3600 * 24)
  )

  layer.bindPopup(
    `<div class="item">
      <i class="fa fa-map-signs" aria-hidden="true"></i>
      <p class="title">Flooding Incident</p>
      <p class="info">Enquiry Number: ${feature.properties.enquiry_number}</p>
      <p class="info">${feature.properties.flood_type} reported.</p>
      <p class="info">Flood reported ${noOfDays} days ago</p>
    </div>`)
  }

export { floodingPopup }