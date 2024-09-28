/* ------------ // Función para obtener tarjetas del localStorage ----------- */
export const getStoredCards = () => {
    return JSON.parse(localStorage.getItem('tarjetas')) || [];
};

/* ----------- // Función para guardar tarjetas en el localStorage ---------- */
export const saveCardsToLocalStorage = (cards) => {
    localStorage.setItem('tarjetas', JSON.stringify(cards));
};

/* ------ // Función para guardar una nueva tarjeta en el localStorage ------ */
export const saveToLocalStorage = (tareaValor, prioridadValor) => {
    const existingCards = getStoredCards();
    const newCards = [...existingCards, { tarea: tareaValor, prioridad: prioridadValor }];
    saveCardsToLocalStorage(newCards);
};

/* ---------- // Función para eliminar una tarjeta del localStorage --------- */
export const removeFromLocalStorage = (tareaValor, prioridadValor) => {
    const cards = getStoredCards();
    const updatedCards = cards.filter(card => card.tarea !== tareaValor || card.prioridad !== prioridadValor);
    saveCardsToLocalStorage(updatedCards);
};

/* -------- // Función para cargar las tarjetas desde el localStorage ------- */
export const loadCards = () => {
    const cards = getStoredCards();
    cards.forEach(cardData => {
        const { tarea, prioridad } = cardData;
        let text;
        let color;

        if (prioridad < 2) {
            text = "Baja Importancia.";
            color = "blue";
        } else if (prioridad === 2) {
            text = "Importancia Exacta.";
            color = "yellowgreen";
        } else {
            text = "Alta Importancia.";
            color = "red";
        }

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

        const closeButton = document.createElement("button");
        closeButton.textContent = "X";
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
                    removeFromLocalStorage(tarea, prioridad);
                    Swal.fire('Eliminado', 'La tarjeta ha sido eliminada.', 'success');
                }
            });
        });

        card.innerHTML = `
            <h3>Prioridad de la tarjeta: ${prioridad}</h3>
            <p>Contenido: ${tarea.toUpperCase()}</p>
            <p style="color: ${color}">${text}</p>
        `;
        card.appendChild(closeButton);
        document.querySelector(".cardContainer").appendChild(card);
    });
};
