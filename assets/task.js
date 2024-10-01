import { saveToLocalStorage, loadCards, removeFromLocalStorage, updateLocalStorage } from './localStorage.js';

import generateSecureId from './IdTask.js';

export const getPrioridad = () => {
    const tarea = document.querySelector(".task")
    const selectPrioridad = document.querySelector("#priority")
    const cardContenedor = document.querySelector(".cardContainer");
    const errorMessage = document.querySelector(".error-message");

    let tareaValor = tarea.value
    let prioridadValor = +selectPrioridad.value

    if (!tareaValor.trim() || prioridadValor === 0) {
        Toastify({
            text: "Todos los Campos son requeridos",
            duration: 1000,
            gravity: "bottom",
            position: "center",
            stopOnFocus: true,
            style: {
                background: "#513C27",
            },
        }).showToast();
        return;
    }

    let text, color;

    if (prioridadValor < 2) {
        text = "Baja Importancia.";
        color = "blue";
    } else if (prioridadValor === 2) {
        text = "Media Importancia.";
        color = "yellowgreen";
    } else {
        text = "Alta Importancia.";
        color = "red";
    }


    const idTask = generateSecureId()

    const card = document.createElement("div");
    card.classList.add("tarjeta");
    card.style.position = "relative";
    card.style.width = "315px";
    card.style.border = "1px solid black";
    card.style.borderRadius = "5px";
    card.style.boxShadow = "10px 10px 20px rgba(0, 0, 0, 0.4)";
    card.style.margin = "10px";
    card.style.padding = "10px";
    card.style.background = "white";
    card.style.wordBreak = "break-all";
    card.dataset.id = idTask



    const closeButton = document.createElement("button");
    closeButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    closeButton.style.position = "absolute";
    closeButton.style.top = "5px";
    closeButton.style.right = "5px";
    closeButton.style.color = "red";
    closeButton.style.background = "transparent";
    closeButton.style.fontSize = "10px";
    closeButton.style.cursor = "pointer";


    closeButton.addEventListener('click', () => {
        Swal.fire({
            title: "¿Deseas eliminar esta tarjeta?",
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                card.remove();
                removeFromLocalStorage(tareaValor, prioridadValor);
                Swal.fire('Eliminado', 'La tarjeta ha sido eliminada.', 'success');
            }
        });
    });

    /* -------------------------------------------------------------------------- */

    const updateButton = document.createElement("button");
    updateButton.innerHTML = '<i class="fa-solid fa-pencil"></i>';
    updateButton.style.position = "absolute";
    updateButton.style.bottom = "4px";
    updateButton.style.right = "5px";
    updateButton.style.cursor = "pointer";

    // Evento para actualizar la tarjeta
    updateButton.addEventListener('click', () => {
        Swal.fire({
            title: 'Actualizar tarea',
            html: `
                <input type="text" id="tareaEditada" class="swal2-input" value="${tareaValor}">
                <select id="prioridadEditada" class="swal2-input">
                    <option value="1" ${prioridadValor === 1 ? 'selected' : ''}>Baja</option>
                    <option value="2" ${prioridadValor === 2 ? 'selected' : ''}>Media</option>
                    <option value="3" ${prioridadValor === 3 ? 'selected' : ''}>Alta</option>
                </select>
            `,
            confirmButtonText: 'Guardar',
            focusConfirm: false,
            preConfirm: () => {
                const tareaEditada = Swal.getPopup().querySelector('#tareaEditada').value;
                const prioridadEditada = +Swal.getPopup().querySelector('#prioridadEditada').value;

                if (!tareaEditada.trim() || !prioridadEditada === 0) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return;
                }

                // Actualizar la tarjeta y el localStorage
                tareaValor = tareaEditada;
                prioridadValor = +prioridadEditada;

                let text, color;

                if (prioridadValor < 2) {
                    text = "Baja Importancia.";
                    color = "blue";
                } else if (prioridadValor === 2) {
                    text = "Media Importancia.";
                    color = "yellowgreen";
                } else {
                    text = "Alta Importancia.";
                    color = "red";
                }

                card.querySelector('p').textContent = `Contenido: ${tareaEditada.toUpperCase()}`;
                card.querySelector('h3').textContent = `Prioridad de la tarjeta: ${prioridadEditada}`;
                card.querySelector('p[style]').textContent = text;
                card.querySelector('p[style]').style.color = color;

                // Actualizar en localStorage
                updateLocalStorage(idTask, tareaEditada, +prioridadEditada);
            }
        });
    });


    card.innerHTML = `
        <h3>Prioridad de la tarjeta: ${prioridadValor}</h3>
        <p>Contenido: ${tareaValor.toUpperCase()}</p>
        <p style="color: ${color}">${text}</p>
    `;



    card.appendChild(closeButton);
    card.appendChild(updateButton);
    cardContenedor.appendChild(card);

    saveToLocalStorage(idTask, tareaValor, prioridadValor);

    tarea.value = "";
    selectPrioridad.value = "";
    errorMessage.textContent = "";

}



document.addEventListener("DOMContentLoaded", loadCards); 
