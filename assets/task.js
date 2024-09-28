const getPrioridad = () => {
    const tarea = document.querySelector(".task")
    const selectPrioridad = document.querySelector("#priority")
    const cardContenedor = document.querySelector(".cardContainer")
    const errorMessage = document.querySelector(".error-message");

    let tareaValor = tarea.value
    let prioridadValor = +selectPrioridad.value


    if (!tareaValor.trim() || prioridadValor === 0) {
        Toastify({
            text: "Todos los Campos son requeridos",
            duration: 3000,
            gravity: "bottom",
            position: "center",
            stopOnFocus: true,
            style: {
                background: "#513C27",
            },
        }).showToast();
        return
    }


    let text
    let color

    if (prioridadValor < 2) {
        text = `"Baja Importancia."`
        color = "blue"

    } else if (prioridadValor === 2) {
        text = `"Importancia Exacta".`
        color = "yellowgreen"
    } else {
        text = `"Alta Importancia".`
        color = "red"
    }


    const card = document.createElement("div")
    card.classList.add("tarjeta")
    card.style.position = "relative";
    card.style.width = "315px";
    card.style.border = "1px solid black";
    card.style.borderRadius = "5px"
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
                errorMessage.textContent = "";
                Swal.fire('Eliminado', 'La tarjeta ha sido eliminada.', 'success');

                removeFromLocalStorage(tareaValor, prioridadValor);
            }
        });
    });


    card.innerHTML = `
    <h3 >Prioridad de la tarjeta: ${prioridadValor ? prioridadValor : "No Existe"} </h3>
    <p >Contenido:  ${tareaValor.toUpperCase() ? tareaValor : "No Existe"}</p>
    <p style="color: ${color} ">${text}</p>
    `
    card.appendChild(closeButton);

    cardContenedor.appendChild(card)

    saveToLocalStorage(tareaValor, prioridadValor);


    tarea.value = ""
    selectPrioridad.value = ""
    errorMessage.textContent = ""

}


const saveToLocalStorage = (tareaValor, prioridadValor) => {
    localStorage.setItem('tarjetas', JSON.stringify([
        ...JSON.parse(localStorage.getItem('tarjetas')) || [],
        { tarea: tareaValor, prioridad: prioridadValor }
    ]))
}

const loadCards = () => {
    const cards = JSON.parse(localStorage.getItem('tarjetas')) || [];
    cards.forEach(cardData => {
        const { tarea, prioridad } = cardData;
        let text;
        let color;

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
}


const removeFromLocalStorage = (tareaValor, prioridadValor) => {
    const cards = JSON.parse(localStorage.getItem('tarjetas')) || [];
    localStorage.setItem('tarjetas', JSON.stringify(cards.filter(card => card.tarea !== tareaValor || card.prioridad !== prioridadValor)));
    console.log(cards)
}

document.addEventListener("DOMContentLoaded", loadCards);
