export const saveToLocalStorage = (id, tarea, prioridad) => {
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

    const nuevaTarea = {
        id,         // ID único de la tarea
        tarea,      // Contenido de la tarea
        prioridad   // Prioridad de la tarea
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


export const updateLocalStorage = (id, tareaActualizada, prioridadActualizada) => {
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

    // Mapear las tareas y actualizar la que tenga el mismo ID
    tareas = tareas.map(tarea => {
        if (tarea.id === id) {
            return {
                ...tarea,
                tarea: tareaActualizada,            // Actualizar contenido de la tarea
                prioridad: prioridadActualizada     // Actualizar prioridad de la tarea
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

    tareas.forEach(({ id, tarea, prioridad }) => {
        // Crear la tarjeta con los mismos estilos y lógica
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
        card.dataset.idCard = id  // Asignamos el ID al elemento

        // Asignar la prioridad y color
        let text, color;
        if (prioridad < 2) {
            text = "Baja Importancia.";
            color = "blue";
        } else if (prioridad === 2) {
            text = "Media Importancia.";
            color = "yellowgreen";
        } else {
            text = "Alta Importancia.";
            color = "red";
        }

        card.innerHTML = `
            <h3>Prioridad de la tarjeta: ${prioridad}</h3>
            <p>Contenido: ${tarea.toUpperCase()}</p>
            <p style="color: ${color}">${text}</p>
        `;

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
                    removeFromLocalStorage(id);  // Eliminar por ID en localStorage
                    Swal.fire('Eliminado', 'La tarjeta ha sido eliminada.', 'success');
                }
            });
        });

        // Botón de actualizar
        const updateButton = document.createElement("button");
        updateButton.innerHTML = '<i class="fa-solid fa-pencil"></i>';
        updateButton.style.position = "absolute";
        updateButton.style.bottom = "4px";
        updateButton.style.right = "5px";
        updateButton.style.cursor = "pointer";

        updateButton.addEventListener('click', () => {
            Swal.fire({
                title: 'Actualizar tarea',
                html: `
                    <input type="text" id="tareaEditada" class="swal2-input" value="${tarea}">
                    <select id="prioridadEditada" class="swal2-input">
                        <option value="1" ${prioridad === 1 ? 'selected' : ''}>Baja</option>
                        <option value="2" ${prioridad === 2 ? 'selected' : ''}>Media</option>
                        <option value="3" ${prioridad === 3 ? 'selected' : ''}>Alta</option>
                    </select>
                `,
                confirmButtonText: 'Guardar',
                focusConfirm: false,
                preConfirm: () => {
                    const tareaEditada = Swal.getPopup().querySelector('#tareaEditada').value;
                    const prioridadEditada = Swal.getPopup().querySelector('#prioridadEditada').value;

                    if (!tareaEditada.trim() || !prioridadEditada === 0) {
                        Swal.showValidationMessage('Todos los campos son obligatorios');
                        return;
                    }

                    // Actualizar la tarjeta y el localStorage
                    card.querySelector('p').textContent = `Contenido: ${tareaEditada.toUpperCase()}`;
                    card.querySelector('h3').textContent = `Prioridad de la tarjeta: ${prioridadEditada}`;


                    let color, text;
                    if (prioridadEditada < 2) {
                        text = "Baja Importancia.";
                        color = "blue";
                    } else if (prioridadEditada == 2) {
                        text = "Media Importancia.";
                        color = "yellowgreen";
                    } else {
                        text = "Alta Importancia.";
                        color = "red";
                    }

                    card.innerHTML = `
                        <h3>Prioridad de la tarjeta: ${prioridadEditada}</h3>
                        <p>Contenido: ${tareaEditada.toUpperCase()}</p>
                        <p style="color: ${color}">${text}</p>
                    `;



                    card.appendChild(updateButton);
                    card.appendChild(closeButton);


                    // Actualizar en localStorage
                    updateLocalStorage(id, tareaEditada, +prioridadEditada);

                }
            });
        });

        card.appendChild(closeButton);
        card.appendChild(updateButton);
        cardContenedor.appendChild(card);
    });
};
