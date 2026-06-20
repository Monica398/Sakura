document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector(".formulario");
    const campoPass = document.getElementById("contrasena");
    const campoConfirm = document.getElementById("confirmar");
    const campoCorreo = document.getElementById("correo");
    const mensajeError = document.getElementById("error-contrasena");

    /*=====================================
    validacion de contraseñas
    ======================================*/
    campoConfirm.addEventListener("input", function () {
        if (campoPass.value !== campoConfirm.value) {
            mensajeError.textContent = "Las contraseñas no coinciden.";
            mensajeError.style.display = "block";
            campoConfirm.style.borderColor = "#c0392b";
        } else {
            mensajeError.textContent = "";
            mensajeError.style.display = "none";
            campoConfirm.style.borderColor = "";
        }
    });

    /*======================================
    crear cuenta
    =======================================*/
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault(); // evita que la pagina se recargue

        if (campoPass.value !== campoConfirm.value) {
            mensajeError.textContent = "Las contraseñas no coinciden.";
            mensajeError.style.display = "block";
            return;
        }

        // se lee el array de usuarios del localStorage y si no hay, se crea vacío
        const datos = localStorage.getItem("usuarios");
        const usuarios = datos ? JSON.parse(datos) : [];
        const correoIngresado = campoCorreo.value.trim().toLowerCase();

        const yaExiste = usuarios.some(function (u) {
            return u.correo.toLowerCase() === correoIngresado;
        });

        if (yaExiste) {
            mensajeError.textContent = "Ya existe una cuenta con ese correo electrónico.";
            mensajeError.style.display = "block";
            return;
        }

        guardarUsuario(usuarios);
    });

    /*==============================
    guardar en el localStorage
    ===============================*/
    function guardarUsuario(usuarios) {
        const nuevoUsuario = {
            nombre: document.getElementById("nombre").value.trim(),
            correo: campoCorreo.value.trim(),
            contrasena: campoPass.value.trim(),
            telefono: document.getElementById("telefono").value.trim(),
            fechaRegistro: new Date().toLocaleDateString("es-CR")
        };

        usuarios.push(nuevoUsuario); // se agrega al array

        localStorage.setItem("usuarios", JSON.stringify(usuarios));          // guarda el array completo
        localStorage.setItem("usuarioActivo", JSON.stringify(nuevoUsuario)); // guarda quien está activo

        mensajeError.textContent = "¡Cuenta creada con éxito! Bienvenida a Sakura 🌸";
        mensajeError.style.display = "block";
        mensajeError.style.color = "#155724";
        mensajeError.style.backgroundColor = "#d4edda";
        mensajeError.style.borderColor = "#c3e6cb";

        formulario.reset();

       /* setTimeout(function () {
            window.location.href = "index.html";
        }, 2000);*/
    }

}); // fin DOMContentLoaded


/*==============================
toggle del ojo ver contraseña
===============================*/
function togglePassword(idCampo, boton) {
    const campo = document.getElementById(idCampo);

    if (campo.type === "password") {
        campo.type = "text";
        boton.title = "Ocultar contraseña";
    } else {
        campo.type = "password";
        boton.title = "Mostrar contraseña";
    }
}