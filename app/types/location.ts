// Location data types for Bangladesh geography
// Supports bilingual names (English and Bengali)

export interface LocationData {
  id: string
  name: string
  bn_name: string
  division_id?: string  // For districts
  district_id?: string  // For upazilas
  lat?: string
  lon?: string
}
