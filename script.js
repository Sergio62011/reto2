// Para acceder a los elementos del HTML ya no usamos document.getElementById —
// usamos document.querySelector, que acepta cualquier selector CSS (#id, .clase,
// etiqueta...) y no solo ids. Por ejemplo: document.querySelector("#filtro-nombre").

async function obtenerPersonajes() {
    // TODO: pide "https://rickandmortyapi.com/api/character" con fetch, conviértela
    // a JSON y devuelve el array de personajes (repasa el ejercicio 1 de la práctica).
    const response = await fetch("https://rickandmortyapi.com/api/character");
    const personajes = await response.json();
    return personajes.results;
}

function filtrarPorEstado(personajes, estado) {
    // TODO: si estado viene vacío, devuelve personajes tal cual. Si no, filtra
    // dejando solo los que coinciden (repasa el ejercicio 2 de la práctica).
    if (estado === "") {
        return personajes;
    }
    const filtrados = personajes.filter(personaje => personaje.status.toLowerCase() === estado.toLowerCase());
    return filtrados
}

function filtrarPorEspecie(personajes, especie) {
    // TODO: si especie viene vacía, devuelve personajes tal cual. Si no, filtra
    // dejando solo los que coinciden (repasa el ejercicio 3 de la práctica).

    if (especie === "") {
        return personajes;
    }
    const filtrados = personajes.filter(personaje => personaje.species.toLowerCase() === especie.toLowerCase());
    return filtrados
}

let personajes = [];
let nombres = [];
let mostrar = false;

function encontrarNombres() {
    for (let i = 0; i < personajes.length; i++) {
        nombres.push(personajes[i].name)
    };
}

function aplicarFiltros() {
    const nombre = document.querySelector("#filtro-nombre").value.trim().toLowerCase();
    const estado = document.querySelector("#filtro-estado").value;
    const especie = document.querySelector("#filtro-especie").value;

    let filtrados = filtrarPorEstado(personajes, estado);
    filtrados = filtrarPorEspecie(filtrados, especie);
    filtrados = filtrados.filter(function (personaje) {
        return personaje.name.toLowerCase().includes(nombre);
    });

    if (ordenar) {
        filtrados = ordenarPersonajes(filtrados)
    }
    if (mostrar) {
        filtrados = mostrarPrimeros(filtrados);
    }
    pintarResultados(filtrados);
}

function contarEstado(lista, estado) {
    return lista.reduce((contador, personaje) => personaje.status === estado ? contador + 1 : contador, 0);
}

function pintarResultados(lista) {
    const contenedor = document.querySelector("#resultados");
    document.querySelector("#contador").textContent = lista.length + " personajes encontrados";
    document.querySelector("#contador-stats").textContent = (`${contarEstado(lista, "Alive")} vivos · ${contarEstado(lista, "Dead")} muertos · ${contarEstado(lista, "unknown")} desconocidos`);

    const hayMuertos = lista.some(personaje => personaje.status === "Dead");
    const todosVivos = lista.every(personaje => personaje.status === "Alive");

    const mensaje = document.querySelector("#hay-muertos");
    mensaje.classList.remove("muertos", "vivos", "desconocidos");

    if (hayMuertos) {
        mensaje.textContent = "Hay muertos en el resultado";
        mensaje.classList.add("muertos");
    } else if (todosVivos) {
        mensaje.textContent = "Todos vivos";
        mensaje.classList.add("vivos");
    } else {
        mensaje.textContent = "Hay desconocidos";
        mensaje.classList.add("desconocidos");
    }

    contenedor.innerHTML = lista
        .map(function (personaje) {
            return (
                '<article class="personaje-card">' +
                '<img src="' + personaje.image + '" alt="' + personaje.name + '" />' +
                "<h3>" + personaje.name + "</h3>" +
                "<p>" + personaje.status + " · " + personaje.species + "</p>" +
                "</article>"
            );
        })
        .join("");
}

function verificarMostrarPrimero() {
    mostrar = mostrar ? false : true;
    aplicarFiltros();
}

function mostrarPrimeros(lista) {
    return lista.slice(0, 10);
}

let ordenar = false;

function verificarOrdenar() {
    ordenar = ordenar ? false : true;
    if (ordenar) {
        document.querySelector('#ordenar').classList.add("activo")
    } else {
        document.querySelector('#ordenar').classList.remove("activo");
    }
    aplicarFiltros();
}

function ordenarPersonajes(lista) {
    return ([...lista].sort((a, b) => a.name.localeCompare(b.name)))
}

function buscarPersonaje(nombre) {
    const indice = nombres.indexOf(nombre);

    if (indice !== -1) {
        return personajes[indice];
    }

    return null;
}

document.querySelector("#filtro-nombre").addEventListener("input", aplicarFiltros);
document.querySelector("#filtro-estado").addEventListener("change", aplicarFiltros);
document.querySelector("#filtro-especie").addEventListener("change", aplicarFiltros);
document.querySelector("#mostrar-primeros").addEventListener("change", verificarMostrarPrimero);
document.querySelector("#ordenar").addEventListener("click", verificarOrdenar);

obtenerPersonajes().then(function (datos) {
    personajes = datos;
    encontrarNombres();
    console.log(buscarPersonaje("Rick Sanchez"));
    aplicarFiltros();
});