export const generateAIReport = (soil, moisture, flood_risk, location) => {
  const summary = `At ${location || 'the provided location'}, soil pH ${soil.pH || 'N/A'}, fertility ${soil.fertility || 'N/A'}. Moisture ${(moisture.value||0)*100}% (${moisture.status}). Flood risk ${flood_risk}.`;
  let recommended_crops = [];
  const ph = parseFloat(soil.pH || 6.8);
  if (ph < 6.0) recommended_crops = ['Tea','Pineapple','Sweet Potato'];
  else if (ph <= 7.5) recommended_crops = ['Maize','Beans','Sorghum'];
  else recommended_crops = ['Barley','Oats'];
  if ((moisture.value||0) < 0.3) recommended_crops.push('Cassava');
  const agroforestry_species = ['Grevillea','Sesbania','Calliandra'];
  const immediate_actions = ['Apply organic compost','Use contour planting','Monitor rainfall'];
  return { summary, recommended_crops, agroforestry_species, immediate_actions };
};
