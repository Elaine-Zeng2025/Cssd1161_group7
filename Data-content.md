## **3.data-content.md：**

# Data & Content

## Context
This section defines data structures and content for MealTracker.

## Content

### Data Entities

#### User
* User ID, Username, Email, Password

#### Meal Record
* Meal ID, User ID, Date, Meal Time, Timestamp

#### Food Item
- ** Food Item ID, Meal ID, Food Name, Nutrient Categories

#### Nutrient Categories (6 types)
1. Grains
2. Protein
3. Vegetables
4. Fruits
5. Dairy
6. Snacks

### Sample Data
```json
{
  "meal": {
    "date": "2025-10-07",
    "mealTime": "breakfast",
    "foods": [
      {"name": "Oatmeal", "categories": ["grains"]},
      {"name": "Banana", "categories": ["fruits"]},
      {"name": "Milk", "categories": ["dairy"]}
    ]
  }
} 

