
let flores = [];
let extras = [];


const contenedorFlores = document.getElementById("contenedorFlores");
const listaResumen = document.getElementById("listaResumen");
const subtotalFlores = document.getElementById("subtotalFlores");
const totalGeneral = document.getElementById("totalGeneral");
const totalExtrasTexto = document.getElementById("totalExtras");
const checkTarjeta = document.getElementById("tarjeta");
const checkChocolates = document.getElementById("chocolates");
const btnPagar = document.getElementById("btnPagar");


checkTarjeta.addEventListener("change", actualizarResumen);
checkChocolates.addEventListener("change", actualizarResumen);
// Traemos los filtros del HTML
const filtroTipo = document.getElementById("filtroTipo");
const filtroColor = document.getElementById("filtroColor");
filtroTipo.addEventListener("change", mostrarFlores);
filtroColor.addEventListener("change", mostrarFlores);
btnPagar.addEventListener("click", pagar);
const costoEntrega = 2500;


// Esta función muestra las flores en la página
function mostrarFlores() {


    let contenido = "";


    for (const flor of flores) {

        if (filtroTipo.value !== "Todas" && flor.nombre !== filtroTipo.value) {
            continue;
        }


        let tieneColor = false;


        for (const color of flor.colores) {


            if (color === filtroColor.value) {
                tieneColor = true;
            }
        }

        if (filtroColor.value !== "Todos" && tieneColor === false) {
            continue;
        }

        let botonesColores = "";

        for (const color of flor.colores) {
            botonesColores += `
                <button class="color-${color}" onclick="seleccionarColor(${flor.id}, '${color}')">
                    ${color}
                </button>
            `;
        }
        contenido += `
            <div class="tarjeta-flor">

                <img src="${flor.imagen}" alt="${flor.nombre}">

                <h4>${flor.nombre}</h4>

                <p class="precio">₡${flor.precio} c/u</p>

                <p class="descripcion-flor">${flor.descripcion}</p>

                <p class="texto-colores">Colores disponibles:</p>

                <div class="colores">
                    ${botonesColores}
                </div>

                <div class="cantidad">
                    <button onclick="restarCantidad(${flor.id})">-</button>
                    <span>${flor.cantidad}</span>
                    <button onclick="sumarCantidad(${flor.id})">+</button>
                </div>

            </div>
        `;
    }

    contenedorFlores.innerHTML = contenido;
}


// aumenta la cantidad de una flor
function sumarCantidad(id) {

    for (const flor of flores) {

        if (flor.id === id) {


            flor.cantidad++;
        }
    }


    mostrarFlores();


    actualizarResumen();
}

function restarCantidad(id) {


    for (const flor of flores) {


        if (flor.id === id && flor.cantidad > 0) {


            flor.cantidad--;
        }
    }


    mostrarFlores();


    actualizarResumen();
}


// guarda el color que el usuario seleccionó para una flor
function seleccionarColor(id, color) {

    for (const flor of flores) {


        if (flor.id === id) {


            flor.colorSeleccionado = color;
        }
    }


    mostrarFlores();


    actualizarResumen();
}


// actualiza el resumen del pedido
function actualizarResumen() {


    let contenidoResumen = "";
    let subtotal = 0;
    let totalExtras = 0;

    if (checkTarjeta.checked) {
        totalExtras += 1500;
    }


    if (checkChocolates.checked) {
        totalExtras += 3000;
    }

    for (const flor of flores) {
        if (flor.cantidad > 0) {


            let totalFlor = flor.precio * flor.cantidad;


            subtotal = subtotal + totalFlor;


            contenidoResumen += `
                <div class="item-resumen">
                    <p>
                        ${flor.nombre} x${flor.cantidad}<br>
                        Color: ${flor.colorSeleccionado}
                    </p>

                    <strong>
                        ₡${totalFlor}
                    </strong>
                </div>
            `;
        }
    }

    if (contenidoResumen === "") {
        listaResumen.innerHTML = `
            <p class="mensaje-vacio">
                Aún no has agregado flores.
            </p>
        `;
    } else {


        listaResumen.innerHTML = contenidoResumen;
    }


    subtotalFlores.innerHTML = "₡" + subtotal;


    totalExtrasTexto.innerHTML = "₡" + totalExtras;


    totalGeneral.innerHTML = "₡" + (subtotal + totalExtras + costoEntrega);
    guardarRamoPendiente();
}

function guardarRamoPendiente() {

    const ramoPendiente = {
        flores: flores,
        tarjeta: checkTarjeta.checked,
        chocolates: checkChocolates.checked
    };

    localStorage.setItem("ramoPendiente", JSON.stringify(ramoPendiente));
}
function pagar() {

    const usuarioActivo = localStorage.getItem("usuarioActivo");

    if (usuarioActivo === null) {

        localStorage.setItem("volverArmarRamo", "si");

        alert("Primero debes registrarte para realizar el pago.");

        window.location.href = "registro.html";

    } else {

        alert("Pago realizado correctamente. ¡Gracias por tu compra!");

        localStorage.removeItem("ramoPendiente");

        const datosRamo = localStorage.getItem("ramoPendiente");

        if (datosRamo !== null) {

            const ramoPendiente = JSON.parse(datosRamo);

            flores = ramoPendiente.flores;

            checkTarjeta.checked = ramoPendiente.tarjeta;
            checkChocolates.checked = ramoPendiente.chocolates;

        } else {

            for (const flor of flores) {
                flor.cantidad = 0;
                flor.colorSeleccionado = "";
            }
        }

        checkTarjeta.checked = false;
        checkChocolates.checked = false;

        mostrarFlores();
        actualizarResumen();
    }
}
/*======================
PARTE QUE TENEMOS QUE REVISAR CON RESPESCTO A UNIR EL JSON CON EL JS,TENTATIVA
=======================*/
// Esta parte carga las flores desde el archivo JSON
// sirve para leer el archivo flores.json
fetch("data/flores.json")
    .then(respuesta => respuesta.json())
    .then(datos => {

        // Guardamos las flores del JSON dentro del arreglo flores
        flores = datos.flores;

        // A cada flor le agregamos cantidad y color seleccionado
        for (const flor of flores) {
            flor.cantidad = 0;
            flor.colorSeleccionado = "";
        }

        // Mostramos las flores en la página
        mostrarFlores();

        // Mostramos el resumen inicial
        actualizarResumen();
    });