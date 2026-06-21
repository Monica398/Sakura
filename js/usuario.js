document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector(".formulario-login");
    const campoCorreo = document.getElementById("correo-login");
    const campoPass = document.getElementById("contrasena-login");


    /*=======================================
    Iniciar sesión
    ========================================== */
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();//evita que la pagina se recargue sola

        const correoIngresado = campoCorreo.value.trim();
        const passIngresada = campoPass.value.trim();

        const datos = localStorage.getItem("usuarios");
        const usuarios = datos ? JSON.parse(datos) : [];


        const usuarioEncontrado = usuarios.find(function (u) { // Si lo encuentra retorna el objeto del usuario, si no retorna undefined
            return u.correo === correoIngresado && u.contrasena === passIngresada;
        });

        if (!usuarioEncontrado) {
            mostrarMensaje("Correo o contraseña incorrectos.", "error");
            return
        }

        // Si el usuario existe guardamos su información como sesión activa
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));
        mostrarMensaje("Bienvenido a Sakura", "exito");

        setTimeout(function () {
            window.location.href = "index.html";
        }, 4000);
    })


    function mostrarMensaje(texto, tipo) {
        let mensaje = document.getElementById("mensaje-login");

        if (!mensaje) {
            mensaje = document.createElement("p");
            mensaje.id = "mensaje-login";
            mensaje.style.borderRadius = "6px";
            mensaje.style.padding = "10px 14px";
            mensaje.style.fontSize = "13px";
            mensaje.style.textAlign = "center";
            mensaje.style.marginTop = "10px";
            formulario.insertBefore(mensaje, formulario.querySelector(".btn-iniciar-sesion"));
        }

        if (tipo === "exito") {
            mensaje.style.color = "#155724";
            mensaje.style.backgroundColor = "#d4edda";
            mensaje.style.border = "1px solid #c3e6cb";
        } else {
            mensaje.style.color = "#c0392b";
            mensaje.style.backgroundColor = "#fde8e8";
            mensaje.style.border = "1px solid #f5c6cb";
        }

        mensaje.textContent = texto;
        mensaje.style.display = "block";
    }

})
/*=================================
Toggle del ojo
====================================*/
function togglePasswordLogin(idCampo, boton) {
    const campo = document.getElementById(idCampo);

    if (campo.type === "password") {
        campo.type = "text";         // mostramos la contraseña
        boton.title = "Ocultar contraseña";
    } else {
        campo.type = "password";     // la volvemos a ocultar
        boton.title = "Mostrar contraseña";
    }
}
