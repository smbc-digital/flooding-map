const prowPopup = (feature, layer) => {
  
  const content = `<div class="item"><i class="fa fa-map-signs" aria-hidden="true"></i><p class="title">Public Right of Way</p>
  <p></p>
  <p class="info">PROW Number: ${feature.properties.row}</p>
  <p class="info">Type: ${feature.properties.type}</p>
  
  </div>`
 
  layer.bindPopup(content)
 }
 export {
  prowPopup
}