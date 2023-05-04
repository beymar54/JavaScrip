const db = {
    methods: {
        find: (id)=>{
            return db.items.find(item => item.id == id);
        },
        remove:(items)=>{
            items.forEach(item => {
                const product = db.methods.find(item.id);
                product.qty = product.qty - item.qty;
            });

            console.log(db);
        },
    },
    items: [
        {
            id: 0,
            title: "Funko Pop",
            price: 250,
            qty: 5,
        },
        {
            id: 1,
            title: "Harry Potter DVD",
            price: 345,
            qty: 50,
        },
        {
            id: 2,
            title: "Baterias Phillips",
            price: 1300,
            qty: 80,
        },
    ],
};

const shopppingCart ={
    items:[],
    methods: {
        add: (id, qty) =>{
            const cartItem=shopppingCart.methods.get(id);

            if (cartItem) {
                if (shopppingCart.methods.hasInventory(id, qty + cartItem.qty)) {
                    cartItem.qty++;
                }else{
                    alert("no hay inventario suficiente");
                }
            }else{
                shopppingCart.items.push({ id, qty});
            }
        },
        remove:(id, qty) =>{
            const cartItem = shopppingCart.methods.get(id);
            if (cartItem.qty - 1 > 0) {
                cartItem.qty--;
            }else{
                shopppingCart.items = shopppingCart.items.filter((item) => item.id != id);
            }
        },
        count: () =>{
            return shopppingCart.items.reduce((acc, item) => acc + item.qty, 0);
        },
        get: (id) =>{
            const index = shopppingCart.items.findIndex(item => item.id == id);
            return index >= 0? shopppingCart.items[index] : null;
        },
        getTotal: () =>{
            const total = shopppingCart.items.reduce((acc, item) => {
                const found = db.methods.find(item.id);
                return acc + found.price * item.qty;
            }, 0);
            return total;
        },
        hasInventory: (id, qty) =>{
            return db.items.find(item => item.id == id).qty - qty >= 0;
        },
        purchase: () =>{
            db.methods.remove(shopppingCart.items);
            shopppingCart.items = [];
        },
    },
};

renderStore(); 

function renderStore(){
const html = db.items.map(item =>{
    return `
        <div class="item">
            <div class="title">${item.title}</div>
            <div class="price">${numberToCurrency(item.price)}</div>
            <div class="qty">${item.qty} units</div>

            <div class="actions">
                <button class="add" data-id="${
                    item.id
                }">Add to Shopping Cart</button>
            </div>
        </div>
    `;
});

document.querySelector("#store-container").innerHTML = html.join("");

document.querySelectorAll(".item .actions .add").forEach(button =>{
    button.addEventListener("click", e =>{
        const id = parseInt(button.getAttribute("data-id"));
        const item = db.methods.find(id);

        if (item && item.qty -1 > 0) {
            //añadir a shoping cart
            shopppingCart.methods.add(id, 1);
            console.log(shopppingCart);
            renderShoppingCart();
        }else{
            console.log("Ya no hay Inventario");
        }
    });
});
}

function renderShoppingCart() {
    const html = shopppingCart.items.map(item => {
        const dbItem= db.methods.find(item.id);
        return `
        <div class="item">
            <div class="title">${dbItem.title}</div>
            <div class="price">${numberToCurrency(dbItem.price)}</div>
            <div class="qty">${item.qty} units</div>
            <div class="subtotal">
                subtotal:${numberToCurrency(item.qty * dbItem.price)}
            </div>
            <div class="actions">
                <button class="addOne" data-id="${item.id}">+</button>
                <button class="removeOne" data-id="${item.id}">+</button>
            </div>
        </div>
        `;
    });

    const closeButton = `
        <div class="cart-header">
            <button class="bClose">Close</button>
        </div>
    `;
    const purchaseButton = 
        shopppingCart.items.length > 0 
        ? `
        <div class="cart-actions">
            <button id="bPurchase">Purchase</button>
        </div>
    `
        :"";
    const total = shopppingCart.methods.getTotal();
    const totalContainer = `<div class="total">Total: ${numberToCurrency(
        total
    )}</div>`;

    const shopppingCartContainer = document.querySelector(
        "#shopping-cart-container"
        );

        shopppingCartContainer.classList.remove("hide");
        shopppingCartContainer.classList.add("show");
       
        
    shopppingCartContainer.innerHTML = 
    closeButton + html.join("") + totalContainer + purchaseButton;

    document.querySelectorAll(".addOne").forEach(button => {
        button.addEventListener("click", e => {
            const id = parseInt(button.getAttribute("data-id"));
            shopppingCart.methods.add(id, 1);
            renderShoppingCart();
        });
    });

    document.querySelectorAll(".removeOne").forEach(button => {
        button.addEventListener("click", e => {
            const id = parseInt(button.getAttribute("data-id"));
            shopppingCart.methods.remove(id, 1);
            renderShoppingCart();
        });
    });

    document.querySelector(".bClose").addEventListener("click", (e) => {
        shopppingCartContainer.classList.remove("show");
        shopppingCartContainer.classList.add("hide");
    });
    
    const bPurchase = document.querySelector("#bPurchase");
    if (bPurchase) {
        bPurchase.addEventListener("click", (e) =>{
            shopppingCart.methods.purchase();
            renderStore();
            renderShoppingCart();
        });
    }

}

function numberToCurrency(n){
    return new Intl.NumberFormat("en-US", {
        maximumSignificantDigits: 2,
        style: "currency",
        currency: "USD",
    }).format (n);
}