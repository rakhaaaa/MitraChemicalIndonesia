/** Public contact details from the supplied business card; the pin is area-level until verified. */
export const contactConfig = {
  businessName: 'CV Mitra Chemical Indonesia',
  address: 'Kawasan Modern Kav. 24, Cikande, Kabupaten Serang, Banten',
  area: 'Cikande, Kabupaten Serang, Banten, Indonesia',
  email: 'Ptmchemicalindonesia@gmail.com',
  phone: '+62 822-6079-9626',
  // Google Maps iframe based on the supplied address; verify the exact premises pin separately.
  mapsEmbedUrl: 'https://www.google.com/maps?q=Kawasan%20Modern%20Kav.%2024%2C%20Cikande%2C%20Kabupaten%20Serang%2C%20Banten&z=15&output=embed',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kawasan%20Modern%20Kav.%2024%2C%20Cikande%2C%20Kabupaten%20Serang%2C%20Banten',
  locationIsApproximate: true,
  privacyPolicyUrl: '#privacy',
  defaultCountryCode: '+62',
} as const;
