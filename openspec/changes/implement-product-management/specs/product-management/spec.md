# Product Management Spec

## ADDED Requirements

### Requirement: Admin List Products

The system SHALL allow administrators to view a list of all products.

#### Scenario: Admin views product list

- Given I am an authenticated administrator
- When I navigate to the products page
- Then I see a list of products
- And I see a "Create Product" button

### Requirement: Admin Create Product

The system SHALL allow administrators to create a new product, requiring a root category selection.

#### Scenario: Admin creates a product

- Given I am on the products page
- When I click "Create Product"
- And I select a root "Clothing" category
- And I enter "Summer T-Shirt" as the name
- And I enter "summer-t-shirt" as the slug
- And I submit the form
- Then the product is created
- And I am redirected to the product edit page

### Requirement: Admin Update Product

The system SHALL allow administrators to update product details, including images and content sections.

#### Scenario: Admin updates product details

- Given I am on a product edit page
- When I update the product name to "Winter Jacket"
- And I save the changes
- Then the product name is updated

#### Scenario: Admin adds images

- Given I am on a product edit page
- When I upload "front.jpg" and "back.jpg"
- Then the images are displayed in the gallery
- And the images are associated with the product

#### Scenario: Admin adds text section

- Given I am on a product edit page
- When I add a new "Text" section
- And I enter "This is a great product"
- Then the section is saved with the product

### Requirement: Admin Manage Variants

The system SHALL allow administrators to manage product variants (add, edit, remove) with dynamic attributes.

#### Scenario: Admin adds a variant

- Given I am on a product edit page
- When I click "Add Variant"
- And I enter SKU "TSHIRT-RED-M"
- And I enter Price "29.99"
- And I add an attribute "Color" with value "Red"
- And I add an attribute "Size" with value "M"
- Then the variant is saved
- And it appears in the variants list

### Requirement: Admin Delete Product

The system SHALL allow administrators to delete a product.

#### Scenario: Admin deletes a product

- Given I am on the products page
- When I click delete on a product
- And I confirm the action
- Then the product is removed from the list
