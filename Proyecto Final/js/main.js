// ******************************************* modal del carrito **************************************** //

const imgCarrito = document.getElementById("imgCarrito");
const modal = document.getElementById("modal");
const volver = document.getElementById("volver");

imgCarrito.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("modal--show");
    mostrarCarrito();
})

volver.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("modal--show");
})

// ******************************************* carrito y Mostrar Productos  ****************************** //

let carrito = [];
if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
}

// Mostrar Productos
const contenedorProductos = document.getElementById("contenedorProductos");
const listadoProductos = "../json/productos.json";

fetch(listadoProductos)
    .then(respuesta => respuesta.json())
    .then((datos) => {
        datos.forEach((producto) => {
            const card = document.createElement("div");
            card.innerHTML += `
                <div class="productos">
                <img src="${producto.img}" alt="${producto.nombre}">
                <h4>${producto.nombre}</h4>
                <p>${producto.precio}</p>
                <button id="${producto.id}">Agregar</button>
                </div>
            `
            contenedorProductos.appendChild(card);

            // Boton para agregar al carrito
            const boton = document.getElementById(`${producto.id}`);
            boton.addEventListener("click", () => {
                agregarAlCarrito(producto.id)
            })
        })
    })
.catch(error => console.log(error));

// Agregar al Carrito
async function agregarAlCarrito(id) {
    const response = await fetch(listadoProductos);
    const productos = await response.json();

    const producto = productos.find((producto) => producto.id === id);
    const productoEnCarrito = carrito.find((producto) => producto.id === id);
    if(productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push(producto);
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }
    calcularTotal();
    
    // ******* Toastify ******* //
    mostrarAviso();
}

function mostrarAviso() {
    Toastify({
        text: "producto agregado al carrito",
        duration: 3000,
        gravity: "bottom",
        position: "right",
    }).showToast();    
}

// Ver Carrito 
const contenedorCarrito = document.getElementById("contenedorCarrito");

const mostrarCarrito = () => {
    contenedorCarrito.innerHTML = "";
    carrito.forEach((producto) => {
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="productoCarrito">
                <img src="${producto.img}" alt="${producto.nombre}">
                <div>
                    <h4>${producto.nombre}</h4>
                    <section>
                        <p>${producto.precio}</p>
                        <p>${producto.cantidad}</p>
                    </section>
                    <button id="eliminar${producto.id}">Eliminar</button>
                </div>
            </div>
        `
        contenedorCarrito.appendChild(card);
        
        // eliminar Producto del Carrito
        const boton = document.getElementById(`eliminar${producto.id}`);
        boton.addEventListener("click", () => {
            eliminarDelCarrito(producto.id);
        })
    })
    calcularTotal();
}

const eliminarDelCarrito = (id) => {
    const producto = carrito.find((producto) => producto.id === id);
    const indice = carrito.indexOf(producto);
    carrito.splice(indice, 1);

    mostrarCarrito();

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Borrar todo del carrito
const vaciarCarrito = document.getElementById("vaciarCarrito");
vaciarCarrito.addEventListener("click", () => {
    eliminarTodo();
})

const eliminarTodo = () => {
    carrito = [];
    mostrarCarrito();
    localStorage.clear();
}

// calcular el total de la compra
const total = document.getElementById("total");
const calcularTotal = () => {
    let totalCompra = 0;
    carrito.forEach((producto) => {
        totalCompra += producto.precio * producto.cantidad;
    })
    total.innerHTML = `$${totalCompra}`;
}

// ******************************************* Modal Final  ****************************** //

const enviar = document.getElementById("enviar");
const modalCierre = document.getElementById("modalCierre");
const volverCierre = document.getElementById("volverCierre"); 

enviar.addEventListener("click", (e) => {
    e.preventDefault();
    modalCierre.classList.add("modal--show");
    modal.classList.remove("modal--show");
})

volverCierre.addEventListener("click", () => {
    modalCierre.classList.remove("modal--show");
})