const flooding_testPopup = (feature, layer) => {
  
  const content = `<div class="item"><i class="fa fa-map-signs" aria-hidden="true"></i><p class="title">Flooding Incident</p>
  <p></p>
  <p class="info">Enquiry Number: ${feature.properties.enquiry_number}</p>
  <p class="info">Type: ${feature.properties.status_name}</p>
  <p class="info">Date reported: ${feature.properties.job_entry_date}</p>
  
  </div>`
 
  layer.bindPopup(content)
 }
 export {
  flooding_testPopup
}