import React from 'react'

export default function GeneratorQR({
	value,
	size = "180x180",
	color = "000000",
	bgColor = "ffffff"
}) {

	if(!value) return null

  const src = `https://api.qrserver.com/v1/create-qr-code/?data=${value}&size=${size}&color=${color}&bgcolor=${bgColor}`;
  
  return (
	  <img 
      src={src}
      alt="QR Code"
    />
  )
}
