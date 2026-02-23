/**
 * Accessories Mapper
 * Maps product slugs to their accessory product slugs
 *
 * Key: Product slug
 * Value: Array of accessory product slugs
 */
export const accessoriesMapper: Record<string, string[]> = {
  'faucet-filter': [
    'filter-cartridge'
  ],
  // Add more product-accessory mappings here
  // Example:
  // 'water-purifier': ['filter-cartridge', 'membrane-kit'],
  // 'shower-head': ['hose-connector', 'wall-mount'],
}

/**
 * Get accessory slugs for a given product slug
 * @param slug - The product slug to look up
 * @returns Array of accessory slugs, or empty array if none found
 */
export function getAccessorySlugs(slug: string): string[] {
  return accessoriesMapper[slug] || []
}

/**
 * Check if a product has any accessories
 * @param slug - The product slug to check
 * @returns true if the product has accessories, false otherwise
 */
export function hasAccessories(slug: string): boolean {
  const accessories = accessoriesMapper[slug]
  return accessories !== undefined && accessories.length > 0
}
