# Architecture & Components



## Context

This section outlines the system architecture for MealTracker application.



## Content



### System Architecture

**Three-tier architecture:**

- **Presentation Layer:** User interface for input and reports

- **Business Logic Layer:** Process meal data and generate reports

- **Data Layer:** Database storage



### Key Components



#### 1. Meal Input Module

- Capture meal time and food items

- Validate input

- Save to database



#### 2. Nutrition Categorization Module

- Manage 6 nutrient categories (grains, protein, vegetables, fruits, dairy, snacks)

- Tag food items with categories

- Calculate totals



#### 3. Report Generation Module

- Retrieve meal data

- Calculate nutritional distribution



## Decisions

- Use three-tier architecture — Team, Oct 7, 2025



## Next Steps

- [ ] Select database technology
