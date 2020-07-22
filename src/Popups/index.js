const floodingPopup = (feature, layer) => layer.bindPopup(
  `<div class="item">
    <i class="fa fa-map-signs" aria-hidden="true"></i>
    <p class="title">Flooding Incident</p>
    <p class="info">Enquiry Number: ${feature.properties.enquiry_number}</p>
    <p class="info">Type: ${feature.properties.status_name}</p>
    <p class="info">Reported Date: ${feature.properties.job_entry_date}</p>
  </div>`)

export { floodingPopup }