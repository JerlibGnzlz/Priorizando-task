
const getPrioridad = () => {
    const tarea = document.querySelector(".task")
    const selectPrioridad = document.querySelector("#priority")
    const cardContenedor = document.querySelector(".cardContainer")
    const errorMessage = document.querySelector(".error-message");

    let tareaValor = tarea.value
    let prioridadValor = +selectPrioridad.value


    if (!tareaValor.trim() || prioridadValor === 0) {
        errorMessage.textContent = "Todos los Campos son requeridos"
        return
    }

    if (prioridadValor < 7) {
        text = `"Baja Importancia."`
        color = "blue"

    } else if (prioridadValor === 7) {
        text = `"Importancia Exacta".`
        color = "yellowgreen"
    } else {
        text = `"Alta Importancia".`
        color = "red"
    }


    const card = document.createElement("div")
    card.classList.add("tarjeta")
    card.style.width = "300px";
    card.style.border = "1px solid black";
    card.style.borderRadius = "5px"
    card.style.boxShadow = "10px 10px 20px rgba(0, 0, 0, 0.4)";
    card.style.margin = "10px";
    card.style.padding = "10px";
    card.style.background = "white";
    card.style.wordBreak = "break-all";



    card.innerHTML = `
    <h3 >Prioridad de la tarjeta: ${prioridadValor ? prioridadValor : "No Existe"} </h3>
    <p >Contenido:  ${tareaValor.toUpperCase() ? tareaValor : "No Existe"}</p>
    <p style="color: ${color} ">${text}</p>
    `
    cardContenedor.appendChild(card)

    tarea.value = ""
    selectPrioridad.value = ""
    errorMessage.innerHTML = ""
}