# AddRecipe

This project is a complete web application that lets users easily create, view, edit, and save their favorite cooking recipes. It acts as a personal digital cookbook where all the recipes are stored directly in the web browser.

Main Features ---------
This recipe book is designed to be simple and powerful.

Save and Load Data: All the recipes are automatically saved in the browser using Local Storage. This means the recipes will still be there even after user closes and reopens the app.

Full Management (CRUD): User can add new recipes, see the full details of any recipe, edit existing ones, and delete them. This makes it a complete tool for managing your collection.

Fast Searching: User can quickly find any recipe using the search bar, which looks for keywords in both the recipe name and the list of ingredients.

Clean Interface: The design is modern, spacious, and easy to read, styled using Tailwind CSS. It clearly separates the main recipe list, the "Add/Edit" form, and the detailed view of each recipe.

Simple Page Transitions: The app provides a smooth, single-page experience, moving quickly between the list, the detail view, and the editor.

Technologies Used and their purpose ----------
HTML5	Sets up the structure for the whole application, including the header, forms, and recipe cards.
JavaScript	Handles all the core logic, including saving data to Local Storage, updating the recipe list, showing details, and managing the forms.
Tailwind CSS	Styles the application with a clean, responsive, and modern look that works well on any device.

Data Storage Method ---------
The application uses Local Storage instead of a server or database. Recipes are saved as a single, specially-formatted text string in the browser. When the app starts, JavaScript loads this string, breaks it down into individual recipes, and displays them. When you make changes, the entire collection is saved back to Local Storage.
