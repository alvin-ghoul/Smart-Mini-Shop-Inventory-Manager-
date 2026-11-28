
// 1. Get the inventory form
const inventoryForm = document.getElementById("inventory-form");

// 2. Get all four input elements
const productName = document.getElementById("product-name");
const productQty = document.getElementById("product-qty");
const productPrice = document.getElementById("product-price");
const productCategory = document.getElementById("product-category");

// 3. Get the inventory list and counters
const inventoryList = document.getElementById("inventory-list");
const productCount = document.getElementById("product-count");
const lowStockCount = document.getElementById("low-stock-count");

// 4. Load saved inventory
const inventory = JSON.parse(localStorage.getItem("shopInventory")) || [];

// 5. Save inventory to localStorage
function saveInventory() {
    localStorage.setItem("shopInventory", JSON.stringify(inventory));
}

// 6. Add new products
inventoryForm.addEventListener("submit", function(e) {

    e.preventDefault();

    // Create a new product object
    const newProduct = {
        id: Date.now(),
        name: productName.value,
        qty: Number(productQty.value),
        price: Number(productPrice.value),
        category: productCategory.value
    };

    // Add product to inventory
    inventory.push(newProduct);

    // Save inventory
    saveInventory();

    // Clear the form
    inventoryForm.reset();

    // Update the inventory display
    renderInventory();
});

// 7. Delete a product
function deleteProduct(id) {

    // Keep products that do not match the selected ID
    const updatedInventory = inventory.filter(function(product) {
        return product.id !== id;
    });

    // Update the original inventory array
    inventory.splice(0, inventory.length, ...updatedInventory);

    // Save the updated inventory
    saveInventory();

    // Refresh the inventory display
    renderInventory();
}

// 8. Display all inventory products
function renderInventory() {

    // Clear the inventory list
    inventoryList.innerHTML = "";

    // Update total product counter
    productCount.textContent = inventory.length;

    // Count products with 5 or fewer items
    const lowStock = inventory.filter(function(product) {
        return product.qty <= 5;
    }).length;

    // Update low stock counter
    lowStockCount.textContent = lowStock;

    // Check if inventory is empty
    if (inventory.length === 0) {

        inventoryList.innerHTML = "<p>No products in stock yet.</p>";

    } else {

        // Display every product
        inventory.forEach(function(product) {

            // Create product card
            const card = document.createElement("div");

            card.style.background = "#f8fafc";
            card.style.padding = "20px";
            card.style.borderRadius = "12px";
            card.style.border = "1px solid #e2e8f0";
            card.style.marginBottom = "12px";

            // Check stock quantity
            let statusBadge;

            if (product.qty <= 5) {

                statusBadge = `
                    <span style="
                        background: #fee2e2;
                        color: #dc2626;
                        padding: 6px 12px;
                        border-radius: 20px;
                        font-weight: bold;">
                        Low Stock!
                    </span>
                `;

            } else {

                statusBadge = `
                    <span style="
                        background: #dcfce7;
                        color: #15803d;
                        padding: 6px 12px;
                        border-radius: 20px;
                        font-weight: bold;">
                        In Stock
                    </span>
                `;
            }

            // Add product information
            card.innerHTML = `
                <h3>${product.name}</h3>

                <p>Category: ${product.category}</p>

                <p>Price: ${product.price.toFixed(2)}</p>

                <p>Quantity: ${product.qty}</p>

                <p>Status: ${statusBadge}</p>

                <button class="remove-btn">
                    Remove
                </button>
            `;

            // Connect Remove button to deleteProduct()
            const removeButton = card.querySelector(".remove-btn");

            removeButton.addEventListener("click", function() {
                deleteProduct(product.id);
            });

            // Add card to inventory list
            inventoryList.appendChild(card);

        });
    }
}

// 9. Display saved inventory when page loads
renderInventory();
