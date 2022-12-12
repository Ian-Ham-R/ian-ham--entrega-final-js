document.addEventListener('DOMContentLoaded', () => {

    // VARIABLES
    const baseDeDatos = [
        {
            id: 1,
            nombre: 'iPhone 14 Pro',
            precio: 25999,
            imagen: './assets/img/iphone-14-pro.png'
        },
        {
            id: 2,
            nombre: 'iPhone 14',
            precio: 20999,
            imagen: './assets/img/iphone-14.png'
        },
        {
            id: 3,
            nombre: 'iPhone 13',
            precio: 15999,
            imagen: './assets/img/iphone-13.png'
        },
        {
            id: 4,
            nombre: 'iPhone SE',
            precio: 11499,
            imagen: './assets/img/iphone-se.png'
        }

    ];



    let carrito = [];
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const miLocalStorage = window.localStorage;










    // FUNCIONES

    /* La función "despliegeCarrito"
    ayuda a desplegar la sección
    "carrito" solo si el carrito 
    tiene elementos dentro, por el
    contrario no lo desplegará o
    lo ocultará en cualquier caso. */
    function despliegeCarrito(articulosCarrito) {
        const elementCarrito = document.getElementById("element-carrito");

        if(articulosCarrito == 0) {
            elementCarrito.classList.remove("display-carrito");
            setTimeout(() => {
                elementCarrito.classList.add("hide");
            }, 1000)
        }
        else {
            elementCarrito.classList.remove("hide");
            setTimeout(() => {
                elementCarrito.classList.add("display-carrito");
            }, 100)
        }
    }

    

    /* La función "priceFormatter"
    permite formatear los precios
    renderizados dependiendo del
    tipo de divisa especificado. */
    function priceFormatter(precio) {
        return precioFormateado = precio.toLocaleString("en", {
            style: "currency",
            currency: "MXN"
        });
    }



    /* La función "renderizarProductos"
    renderiza los productos a partir de
    la base de datos. */
    function renderizarProductos() {
        baseDeDatos.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('card');
            
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');

            const miNodoTitle = document.createElement('p');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;

            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img');
            miNodoImagen.setAttribute('src', info.imagen);

            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${priceFormatter(info.precio)}`;

            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn');
            miNodoBoton.textContent = 'Agregar al Carrito';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);

            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }



    /* La función "anyadirProductoAlCarrito"
    marca el evento para añadir un producto
    al carrito de compra. */
    function anyadirProductoAlCarrito(evento) {
        carrito.push(evento.target.getAttribute('marcador'))

        renderizarCarrito();
        
        guardarCarritoEnLocalStorage();
    }



    /* La función "renderizarCarrito" sirve
    para renderizar los productos agregados
    al carrito. */
    function renderizarCarrito() {
        DOMcarrito.textContent = '';

        const carritoSinDuplicados = [...new Set(carrito)];

        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });

            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);

            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${priceFormatter(miItem[0].precio)}`;

            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'fa', 'fa-trash');
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);

            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });

        DOMtotal.textContent = calcularTotal();
    }



    /* La función "borrarItemCarrito"
    marca el evento para borrar un producto
    del carrito de compra. */
    function borrarItemCarrito(evento) {
        const id = evento.target.dataset.item;

        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });

        renderizarCarrito();

        guardarCarritoEnLocalStorage();
    }



    /* La función "calcularTotal" calcula
    el precio total mientras que toma en 
    cuenta icluso los productos repetidos. */
    function calcularTotal() {
        console.log(carrito.length)
        despliegeCarrito(carrito.length)

        return priceFormatter(carrito.reduce((total, item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });

            return total + miItem[0].precio;
        }, 0));
    }



    /* La función "vaciarCarrito" sirve
    para vaciar el carrito y volver a
    renderizarlo. */
    function vaciarCarrito() {
        carrito = [];

        renderizarCarrito();

        localStorage.clear();
    }



    vaciarCarrito
    function guardarCarritoEnLocalStorage () {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }



    /* La función "cargarCarritoDeLocalStorage"
    sirve para mantener los productos
    agregados al carrito incluso cuando 
    el usuario cierra esta página o navega
    en otras páginas. */
    function cargarCarritoDeLocalStorage () {
        if (miLocalStorage.getItem('carrito') !== null) {
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }










    // EVENTOS
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);










    // INICIO
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});