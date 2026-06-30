const contenedorColecciones = document.getElementById("contenedorColecciones");
function mostrarColecciones(colecciones) {

    let contenido = "";

    for (const coleccion of colecciones) {

        contenido += `
            <a href="${coleccion.enlace}" class="tarjeta-coleccion">

                <img src="${coleccion.imagen}" alt="${coleccion.titulo}">

                <div class="tarjeta-info ${coleccion.clase}">
                    <h3>${coleccion.titulo}</h3>
                    <p>VER COLECCIÓN</p>
                </div>

            </a>
        `;
    }

    // Mostramos las tarjetas en el HTML
    contenedorColecciones.innerHTML = contenido;
}

fetch("data/colecciones.json")
    .then(respuesta => respuesta.json())
    .then(datos => {
        mostrarColecciones(datos.colecciones);
    });