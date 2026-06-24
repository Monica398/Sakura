/*=====================================================
ARREGLOS PRINCIPALES
=====================================================*/

let flores = [];
let extras = [];


/*=====================================================
OBTENER ELEMENTOS DEL HTML
=====================================================*/

const contenedorFlores = document.getElementById("contenedorFlores");
const listaResumen = document.getElementById("listaResumen");
const subtotalFlores = document.getElementById("subtotalFlores");
const totalGeneral = document.getElementById("totalGeneral");
const totalExtrasTexto = document.getElementById("totalExtras");
const checkTarjeta = document.getElementById("tarjeta");
const checkChocolates = document.getElementById("chocolates");
const btnPagar = document.getElementById("btnPagar");
const buscarFlor = document.getElementById("buscarFlor");
const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros");


/*=====================================================
EVENTOS
=====================================================*/

buscarFlor.addEventListener("input", mostrarFlores);
checkTarjeta.addEventListener("change", actualizarResumen);
checkChocolates.addEventListener("change", actualizarResumen);
btnPagar.addEventListener("click", pagar);
btnLimpiarFiltros.addEventListener("click", limpiarFiltros);

const filtroTipo = document.getElementById("filtroTipo");
const filtroColor = document.getElementById("filtroColor");

filtroTipo.addEventListener("change", mostrarFlores);
filtroColor.addEventListener("change", mostrarFlores);



/*=====================================================
COSTOS FIJOS
=====================================================*/

const costoEntrega = 2500;


/*=====================================================
FUNCIÓN LIMPIAR FILTROS
=====================================================*/

function limpiarFiltros() {

    filtroTipo.value = "Todas";
    filtroColor.value = "Todos";
    buscarFlor.value = "";

    mostrarFlores();
}
/*=====================================================
FUNCIÓN MOSTRAR FLORES
=====================================================*/

function mostrarFlores() {

    let contenido = "";

    for (const flor of flores) {

        if (buscarFlor.value !== "") {

            let texto = buscarFlor.value.toLowerCase();

            let coincideNombre = flor.nombre.toLowerCase().includes(texto);

            let coincideColor = false;

            for (const color of flor.colores) {
                if (color.toLowerCase().includes(texto)) {
                    coincideColor = true;
                }
            }

            if (!coincideNombre && !coincideColor) {
                continue;
            }
        }

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


/*=====================================================
FUNCIÓN SUMAR CANTIDAD
=====================================================*/

function sumarCantidad(id) {

    for (const flor of flores) {
        if (flor.id === id) {
            flor.cantidad++;
        }
    }

    mostrarFlores();
    actualizarResumen();
}


/*=====================================================
FUNCIÓN RESTAR CANTIDAD
=====================================================*/

function restarCantidad(id) {

    for (const flor of flores) {
        if (flor.id === id && flor.cantidad > 0) {
            flor.cantidad--;
        }
    }

    mostrarFlores();
    actualizarResumen();
}


/*=====================================================
FUNCIÓN SELECCIONAR COLOR
=====================================================*/

function seleccionarColor(id, color) {

    for (const flor of flores) {
        if (flor.id === id) {
            flor.colorSeleccionado = color;
        }
    }

    mostrarFlores();
    actualizarResumen();
}


/*=====================================================
FUNCIÓN ACTUALIZAR RESUMEN
=====================================================*/

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

    totalGeneral.innerHTML =
        "₡" + (subtotal + totalExtras + costoEntrega);

    guardarRamoPendiente();
}


/*=====================================================
FUNCIÓN GUARDAR RAMO PENDIENTE
=====================================================*/

function guardarRamoPendiente() {

    const ramoPendiente = {
        flores: flores,
        tarjeta: checkTarjeta.checked,
        chocolates: checkChocolates.checked
    };

    localStorage.setItem("ramoPendiente", JSON.stringify(ramoPendiente));
}


/*=====================================================
FUNCIÓN PAGAR
=====================================================*/

function pagar() {

    /*=====================================================
    VALIDAR QUE HAYA FLORES
    =====================================================*/

    let hayFlores = false;

    for (const flor of flores) {
        if (flor.cantidad > 0) {
            hayFlores = true;
        }
    }

    if (hayFlores === false) {
        alert("Debes agregar al menos una flor al ramo.");
        return;
    }

    /*=====================================================
    GUARDAR RAMO ANTES DE CAMBIAR DE PÁGINA
    =====================================================*/

    guardarRamoPendiente();

    /*=====================================================
    VALIDAR SI HAY USUARIO REGISTRADO
    =====================================================*/

    const usuarioActivo = localStorage.getItem("usuarioActivo");

    if (usuarioActivo === null || usuarioActivo === "") {

        localStorage.setItem("volverArmarRamo", "si");

        alert("Primero debes registrarte para realizar el pago.");

        window.location.href = "registro.html";

        return;
    }

    /*=====================================================
    SI SÍ HAY USUARIO, SE REALIZA EL PAGO
    =====================================================*/

    alert("Pago realizado correctamente. ¡Gracias por tu compra!");

    localStorage.removeItem("ramoPendiente");

    for (const flor of flores) {
        flor.cantidad = 0;
        flor.colorSeleccionado = "";
    }

    checkTarjeta.checked = false;
    checkChocolates.checked = false;

    mostrarFlores();
    actualizarResumen();
}


/*=====================================================
CARGAR FLORES DESDE JSON
=====================================================*/

fetch("data/flores.json")

    .then(respuesta => respuesta.json())

    .then(datos => {

        flores = datos.flores;

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

        mostrarFlores();
        actualizarResumen();
    });