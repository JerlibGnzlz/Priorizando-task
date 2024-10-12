export const saveToLocalStorage = (id, tarea, prioridad, bloqueado) => {
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

    const nuevaTarea = {
        id,         // ID único de la tarea
        tarea,      // Contenido de la tarea
        prioridad,   // Prioridad de la tarea
        bloqueado: bloqueado === "true"

    };

    tareas.push(nuevaTarea);  // Agregar la nueva tarea al array
    localStorage.setItem('tareas', JSON.stringify(tareas));  // Guardar el array actualizado en localStorage
};


export const removeFromLocalStorage = (id) => {
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

    // Filtrar para eliminar la tarea con el ID proporcionado
    tareas = tareas.filter(tarea => tarea.id !== id);

    // Guardar las tareas restantes en localStorage
    localStorage.setItem('tareas', JSON.stringify(tareas));
};

export const updateLocalStorage = (id, tareaActualizada, prioridadActualizada, bloqueado) => {
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

    // Mapear las tareas y actualizar la que tenga el mismo ID
    tareas = tareas.map(tarea => {
        if (tarea.id === id) {
            return {
                ...tarea,
                tarea: tareaActualizada,
                prioridad: prioridadActualizada,
                bloqueado: bloqueado === "true"
            };
        }
        return tarea;
    });

    // Guardar las tareas actualizadas en localStorage
    localStorage.setItem('tareas', JSON.stringify(tareas));
};



export const loadCards = () => {
    const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    const cardContenedor = document.querySelector(".cardContainer");

    // Limpiar el contenedor de tarjetas antes de volver a cargar
    cardContenedor.innerHTML = '';

    tareas.forEach(({ id, tarea, prioridad, bloqueado }) => {
        const isBlocked = bloqueado; // Ya es un booleano

        const card = document.createElement("div");
        card.dataset.disabled = bloqueado ? "true" : "false";
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
        card.dataset.idCard = id;

        // Estado inicial de bloqueo
        if (isBlocked) {
            card.style.opacity = "0.5";
            card.style.cursor = "not-allowed";
        } else {
            card.style.opacity = "1";
            card.style.cursor = "default";
        }



        // Botón para eliminar tarjeta
        const closeButton = document.createElement("button");
        closeButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        closeButton.style.position = "absolute";
        closeButton.style.top = "5px";
        closeButton.style.right = "5px";
        closeButton.style.color = "red";
        closeButton.style.background = "transparent";
        closeButton.style.fontSize = "15px";
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
                customClass: {
                    popup: 'custom-swal' // Aplica la clase personalizada
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    card.remove();
                    removeFromLocalStorage(id);
                    Swal.fire('Eliminado', 'La tarjeta ha sido eliminada.', 'success');
                }
            });
        });

        // Botón para bloquear/desbloquear tarjeta
        // const toggleLockButton = document.createElement("button");
        // toggleLockButton.innerHTML = bloqueado ? '<i class="fa-solid fa-lock"></i>' : '<i class="fa-solid fa-lock-open"></i>';
        // toggleLockButton.style.position = "absolute";
        // toggleLockButton.style.left = "20rem";
        // toggleLockButton.style.top = "1.5rem";
        // toggleLockButton.style.margin = "0.5rem";
        // toggleLockButton.style.cursor = "pointer";
        // toggleLockButton.style.fontSize = "15px";

        // toggleLockButton.addEventListener('click', () => {
        //     const isDisabled = card.dataset.disabled === "true";
        //     card.dataset.disabled = isDisabled ? "false" : "true";

        //     if (isDisabled) {
        //         toggleLockButton.innerHTML = '<i class="fa-solid fa-lock-open"></i>';
        //         card.style.opacity = "1";
        //         card.style.cursor = "default";
        //         closeButton.style.display = "block";
        //         updateButton.style.display = "block";
        //     } else {
        //         toggleLockButton.innerHTML = '<i class="fa-solid fa-lock"></i>';
        //         card.style.opacity = "0.5";
        //         card.style.cursor = "not-allowed";
        //         closeButton.style.display = "none";
        //         updateButton.style.display = "none";
        //     }

        //     // Actualizar el estado de bloqueo en localStorage
        //     updateLocalStorage(id, tarea, prioridad, !isDisabled);

        //     // Aquí, actualiza solo el contenido que necesites si es necesario
        //     // Puedes agregar más lógica aquí si deseas cambiar el texto u otros elementos
        // });


        // Botón para actualizar tarjeta
        const updateButton = document.createElement("button");
        updateButton.innerHTML = '<i class="fa-solid fa-pencil"></i>';
        updateButton.style.position = "absolute";
        updateButton.style.bottom = "4px";
        updateButton.style.right = "5px";
        updateButton.style.cursor = "pointer";
        updateButton.style.fontSize = "15px";

        updateButton.addEventListener('click', () => {
            Swal.fire({
                title: 'Actualizar tarea',
                html: `
                    <input type="text" id="tareaEditada" class="swal2-input" maxlength="100"  value="${tarea.trim()} ">
                    <span id="charCount">100 caracteres restantes</span>
                    <select id="prioridadEditada" class="swal2-input">
                        <option value="1" ${prioridad === 1 ? 'selected' : ''}>Baja</option>
                        <option value="2" ${prioridad === 2 ? 'selected' : ''}>Media</option>
                        <option value="3" ${prioridad === 3 ? 'selected' : ''}>Alta</option>
                    </select>
                `,
                confirmButtonText: 'Guardar',
                focusConfirm: false,
                customClass: {
                    popup: 'custom-swal' // Aplica la clase personalizada
                },
                preConfirm: () => {
                    const tareaEditada = Swal.getPopup().querySelector('#tareaEditada').value;
                    const prioridadEditada = Swal.getPopup().querySelector('#prioridadEditada').value;

                    if (!tareaEditada.trim() || !prioridadEditada) {
                        Swal.showValidationMessage('Todos los campos son obligatorios');
                        return;
                    }

                    card.querySelector('h3').textContent = `Prioridad de la tarjeta: ${prioridadEditada}`;
                    card.querySelector('p').textContent = `Contenido: ${tareaEditada}`;

                    let text, color;
                    if (prioridadEditada == 1) {
                        text = "Baja Importancia.";
                        color = "blue";
                    } else if (prioridadEditada == 2) {
                        text = "Media Importancia.";
                        color = "yellowgreen";
                    } else if (prioridadEditada == 3) {
                        text = "Alta Importancia.";
                        color = "red";
                    }

                    card.querySelectorAll('p')[1].textContent = text;
                    card.querySelectorAll('p')[1].style.color = color;

                    // Actualizar en localStorage
                    updateLocalStorage(id, tareaEditada, Number(prioridadEditada), card.dataset.disabled === "true");


                }
            });

            const inputField = Swal.getPopup().querySelector('#tareaEditada');
            const charCount = Swal.getPopup().querySelector('#charCount');

            const updateCharCount = () => {
                const remainingChars = 100 - inputField.value.length;
                charCount.textContent = `${remainingChars} caracteres restantes`;
            };
            // Inicializar el contador al cargar
            updateCharCount();

            // Añadir el evento de entrada al campo de texto
            inputField.addEventListener('input', updateCharCount);
            inputField.addEventListener('focus', updateCharCount)
        });



        let text, color;
        if (prioridad === 1) {
            text = "Baja Importancia.";
            color = "blue";
        } else if (prioridad === 2) {
            text = "Media Importancia.";
            color = "yellowgreen";
        } else if (prioridad === 3) {
            text = "Alta Importancia.";
            color = "red";
        }

        card.innerHTML = `
            <h3>Prioridad de la tarjeta: ${prioridad}</h3>
            <p>Contenido: ${tarea}</p>
            <p style="color: ${color}">${text}</p>
        `;

        // Añadir los botones a la tarjeta
        card.appendChild(closeButton);
        // card.appendChild(toggleLockButton);
        card.appendChild(updateButton);

        // Añadir la tarjeta al contenedor
        cardContenedor.appendChild(card);
    });
};

// Llamar a loadCards al cargar la página
loadCards();
