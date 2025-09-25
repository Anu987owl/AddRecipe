let allRecipes = [];
const RECIPE_DELIMITER = '###RECIPE###';
const FIELD_DELIMITER = '|||';
const INGREDIENT_DELIMITER = '^^^';

function loadRecipes() {
    const recipesString = localStorage.getItem('recipes');
    if (recipesString) {
        allRecipes = recipesString.split(RECIPE_DELIMITER).map(recipeData => {
            const parts = recipeData.split(FIELD_DELIMITER);
            if (parts.length === 4) {
                return {
                    name: parts[0],
                    ingredients: parts[1].split(INGREDIENT_DELIMITER),
                    instructions: parts[2].split(INGREDIENT_DELIMITER),
                    imageUrl: parts[3]
                };
            }
            return null;
        }).filter(recipe => recipe !== null);
    }
}

function saveRecipes() {
    const recipesString = allRecipes.map(recipe => {
        const ingredientsStr = recipe.ingredients.join(INGREDIENT_DELIMITER);
        const instructionsStr = recipe.instructions.join(INGREDIENT_DELIMITER);
        return `${recipe.name}${FIELD_DELIMITER}${ingredientsStr}${FIELD_DELIMITER}${instructionsStr}${FIELD_DELIMITER}${recipe.imageUrl}`;
    }).join(RECIPE_DELIMITER);
    localStorage.setItem('recipes', recipesString);
}

function showMessage(message) {
    document.getElementById('modal-message').textContent = message;
    document.getElementById('message-modal').classList.remove('hidden');
}

window.hideMessage = function() {
    document.getElementById('message-modal').classList.add('hidden');
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';
    
    if (recipes.length === 0) {
        recipeList.innerHTML = `<p class="text-center text-gray-500 col-span-full">No recipes found. Add one to get started!</p>`;
        return;
    }

    recipes.forEach(recipe => {
        const imageUrl = recipe.imageUrl || `https://placehold.co/600x400/0F766E/fff?text=${encodeURIComponent(recipe.name)}`;

        const recipeCard = document.createElement('div');
        recipeCard.className = 'cursor-pointer bg-stone-100 rounded-xl shadow-md p-4 transition duration-300 transform hover:scale-105 hover:shadow-lg';
        recipeCard.innerHTML = `
            <img src="${imageUrl}" alt="${recipe.name}" onerror="this.onerror=null; this.src='https://placehold.co/600x400/0F766E/fff?text=No+Image'" class="w-full h-40 object-cover rounded-lg mb-4">
            <h3 class="text-xl font-semibold text-gray-800">${recipe.name}</h3>
        `;
        recipeCard.onclick = () => showPage('recipe-detail-page', recipe);
        recipeList.appendChild(recipeCard);
    });
}

function displayRecipeDetails(recipe) {
    const detailContent = document.getElementById('recipe-detail-content');
    
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients.map(ing => `<li>${ing}</li>`).join('') : `<li>${recipe.ingredients}</li>`;
    const instructions = Array.isArray(recipe.instructions) ? recipe.instructions.map(inst => `<li>${inst}</li>`).join('') : `<li>${recipe.instructions}</li>`;
    const imageUrl = recipe.imageUrl || `https://placehold.co/600x400/0F766E/fff?text=${encodeURIComponent(recipe.name)}`;
    
    detailContent.innerHTML = `
        <div class="recipe-card">
            <h2 class="text-3xl font-bold text-teal-700 mb-4">${recipe.name}</h2>
            <img src="${imageUrl}" alt="${recipe.name}" onerror="this.onerror=null; this.src='https://placehold.co/600x400/0F766E/fff?text=No+Image'" class="w-full h-auto rounded-lg shadow-md mb-6">
            <div class="mb-6">
                <h3 class="text-2xl font-semibold border-b-2 border-teal-500 pb-2 mb-3">Ingredients</h3>
                <ul class="list-disc pl-5 text-lg text-gray-700 leading-relaxed space-y-2">
                    ${ingredients}
                </ul>
            </div>
            <div>
                <h3 class="text-2xl font-semibold border-b-2 border-teal-500 pb-2 mb-3">Instructions</h3>
                <ol class="list-decimal pl-5 text-lg text-gray-700 leading-relaxed space-y-2">
                    ${instructions}
                </ol>
            </div>
        </div>
    `;

    document.getElementById('edit-button').onclick = () => editRecipe(recipe.name);
    document.getElementById('delete-button').onclick = () => deleteRecipe(recipe.name);
}

window.editRecipe = function(recipeName) {
    const recipeToEdit = allRecipes.find(r => r.name === recipeName);
    if (!recipeToEdit) {
        showMessage('Recipe not found!');
        return;
    }

    document.getElementById('recipe-name').value = recipeToEdit.name;
    document.getElementById('ingredients').value = recipeToEdit.ingredients.join('\n');
    document.getElementById('instructions').value = recipeToEdit.instructions.join('\n');
    document.getElementById('image-url').value = recipeToEdit.imageUrl;
    
    document.getElementById('original-recipe-name').value = recipeToEdit.name;
    document.getElementById('submit-button').textContent = 'Save Changes';
    document.getElementById('add-edit-title').textContent = `Edit Recipe: ${recipeToEdit.name}`;

    showPage('add-recipe-page');
}

window.deleteRecipe = function(recipeName) {
    if (confirm(`Are you sure you want to delete "${recipeName}"?`)) {
        allRecipes = allRecipes.filter(r => r.name !== recipeName);
        saveRecipes();
        showPage('contents-page');
        displayRecipes(allRecipes);
        showMessage('Recipe deleted successfully!');
    }
}

document.getElementById('add-recipe-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('recipe-name').value;
    const ingredients = document.getElementById('ingredients').value.split('\n').filter(line => line.trim() !== '');
    const instructions = document.getElementById('instructions').value.split('\n').filter(line => line.trim() !== '');
    const imageUrl = document.getElementById('image-url').value;
    const originalName = document.getElementById('original-recipe-name').value;

    if (!name || ingredients.length === 0 || instructions.length === 0) {
        showMessage('Please fill out all required fields.');
        return;
    }

    if (originalName) {
        const recipeIndex = allRecipes.findIndex(r => r.name === originalName);
        if (recipeIndex !== -1) {
            allRecipes[recipeIndex] = { name, ingredients, instructions, imageUrl };
            saveRecipes();
            showMessage('Recipe updated successfully!');
        }
    } else {
        const newRecipe = { name, ingredients, instructions, imageUrl };
        allRecipes.push(newRecipe);
        saveRecipes();
        showMessage('Recipe added successfully!');
    }
    
    document.getElementById('add-recipe-form').reset();
    document.getElementById('original-recipe-name').value = '';
    document.getElementById('submit-button').textContent = 'Add Recipe';
    document.getElementById('add-edit-title').textContent = 'Add a New Recipe';
    showPage('contents-page');
    displayRecipes(allRecipes);
});

window.searchRecipes = function() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filteredRecipes = allRecipes.filter(recipe => {
        const nameMatch = recipe.name.toLowerCase().includes(query);
        const ingredientsMatch = Array.isArray(recipe.ingredients) ? recipe.ingredients.some(ing => ing.toLowerCase().includes(query)) : false;
        return nameMatch || ingredientsMatch;
    });
    displayRecipes(filteredRecipes);
}

document.addEventListener('DOMContentLoaded', () => {
    loadRecipes();
    showPage('contents-page');
    displayRecipes(allRecipes); // <--- ADD THIS LINE
});

window.showPage = function(pageId, recipe = null) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    if (pageId === 'recipe-detail-page' && recipe) {
        displayRecipeDetails(recipe);
    }
    
    // <--- ADD THIS BLOCK OF CODE
    if (pageId === 'contents-page') {
      displayRecipes(allRecipes);
    }
}