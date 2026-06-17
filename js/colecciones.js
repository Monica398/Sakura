const contenedorColecciones = document.getElementById("contenedorColecciones");
function mostrarColecciones(colecciones) {

    // Aquí se va guardando el HTML
    let contenido = "";

    // Recorremos cada colección que viene del JSON
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
/*TENTATIVO HAY QUE VER COMO LO HACE LA PROFE*/
// Cargamos el archivo JSON
fetch("data/colecciones.json")
    .then(respuesta => respuesta.json())
    .then(datos => {
        mostrarColecciones(datos.colecciones);
    });