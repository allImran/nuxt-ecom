// Location data utilities for Bangladesh geography
// Imports and parses static JSON files for divisions, districts, and upazilas

import type { LocationData } from '~/types/location'

// Import the JSON files from data directory
import divisionsRaw from '~/data/divisions.json'
import districtsRaw from '~/data/districts.json'
import upazilasRaw from '~/data/upazilas.json'

/**
 * Parse divisions JSON from PHPMyAdmin export format
 * Extracts the data array from the wrapper structure
 */
function parseDivisions(json: typeof divisionsRaw): LocationData[] {
  const dataItem = json.find(item => item.type === 'table' && item.name === 'divisions')
  if (!dataItem?.data) return []
  return dataItem.data as LocationData[]
}

/**
 * Parse districts JSON from PHPMyAdmin export format
 * Extracts the data array from the wrapper structure
 */
function parseDistricts(json: typeof districtsRaw): LocationData[] {
  const dataItem = json.find(item => item.type === 'table' && item.name === 'districts')
  if (!dataItem?.data) return []
  return dataItem.data as LocationData[]
}

/**
 * Parse upazilas JSON from PHPMyAdmin export format
 * Extracts the data array from the wrapper structure
 */
function parseUpazilas(json: typeof upazilasRaw): LocationData[] {
  const dataItem = json.find(item => item.type === 'table' && item.name === 'upazilas')
  if (!dataItem?.data) return []
  return dataItem.data as LocationData[]
}

// Export parsed location data
export const divisions: LocationData[] = parseDivisions(divisionsRaw)
export const districts: LocationData[] = parseDistricts(districtsRaw)
export const upazilas: LocationData[] = parseUpazilas(upazilasRaw)

/**
 * Get the appropriate location name based on locale
 * @param location - The location data object
 * @param isBangla - Whether to use Bengali name
 * @returns The localized name
 */
export function getLocationName(location: LocationData, isBangla: boolean): string {
  return isBangla ? location.bn_name : location.name
}

/**
 * Filter locations by parent ID
 * @param locations - Array of locations to filter
 * @param parentId - Parent ID to filter by (division_id or district_id)
 * @param parentKey - The key to use for parent filtering
 * @returns Filtered array of locations
 */
export function filterLocationsByParent(
  locations: LocationData[],
  parentId: string | null,
  parentKey: 'division_id' | 'district_id'
): LocationData[] {
  if (!parentId) return []
  return locations.filter(loc => loc[parentKey] === parentId)
}

/**
 * Search locations by both English and Bengali names
 * @param locations - Array of locations to search
 * @param query - Search query string
 * @returns Filtered array of matching locations
 */
export function searchLocations(locations: LocationData[], query: string): LocationData[] {
  if (!query) return locations.slice(0, 50) // Limit initial results

  const lowerQuery = query.toLowerCase()
  return locations.filter(location =>
    location.name.toLowerCase().includes(lowerQuery) ||
    location.bn_name.includes(query) // Bengali case-sensitive search
  )
}
