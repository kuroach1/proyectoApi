// Función asincrónica para obtener los nombres de los residentes de una ubicación
const fetchResidentNames = async (residentURLs) => {
    try {
        const residentPromises = residentURLs.map(async (url) => {
            const response = await fetch(url); // Obtiene los datos del residente de la URL
            const residentData = await response.json(); // Convierte la respuesta en formato JSON
            return residentData.name; // Retorna el nombre del residente
        });
        const residentNames = await Promise.all(residentPromises); // Espera a que se resuelvan todas las promesas de nombres de residentes
        return residentNames; // Retorna un array con los nombres de los residentes
    } catch (error) {
        console.error("Error al obtener los nombres de los residentes:", error); // Maneja cualquier error y lo muestra en la consola
        return []; // Retorna un array vacío en caso de error
    }
};

const generateLocationCard = (card, residentNames) => {
    const residentsList = residentNames.slice(0, 5).map(name => `<li>${name}</li>`).join(''); // Limita a 5 residentes al inicio
    let residentsListFull = '';
    if (residentNames.length > 5) {
      residentsListFull = residentNames.slice(5).map(name => `<li>${name}</li>`).join(''); // Almacena el resto de los residentes
    }
    const residentsListSpan = residentsListFull ? `<span class="more-residents" data-residents-list-full="${residentsListFull}" onclick="showMoreResidents(event)">Mostrar más</span>` : ''; // Agrega el botón "Mostrar más"
    return `
        <div class="container-card">
            <img src="img/Screaming-Sun-Planet.avif" alt="imagen de la ubicación" class="image">
            <div class="container-text">
                <h3>${card.name}</h3>
                <p>${card.type} - ${card.dimension}</p>
                <div class="container3">
                    <div class="container-info">
                        <p><span>CREATED:</span> ${card.created}</p>
                        <p><span>RESIDENTS:</span></p>
                        <ul class="residents-list">${residentsList}</ul> <!-- Lista de residentes -->
                        ${residentsListSpan}
                    </div>
                </div>
            </div>
        </div>
    `;
  };

  const showMoreResidents = (event) => {
    const target = event.target;
    const residentsList = target.previousElementSibling;
    residentsList.innerHTML += target.dataset.residentsListFull;
    target.remove();
  };
  
  
  

// Evento al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    const id = 1; // ID de la página inicial
    await getPage(id); // Obtiene la página inicial
});

// Función para obtener una página de ubicaciones
const getPage = async (id) => {
    const container = document.querySelector('.container'); // Contenedor donde se mostrarán las ubicaciones
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/location?page=${id}`); // Obtiene los datos de la página de ubicaciones
        const data = await response.json(); // Convierte la respuesta en formato JSON

        let html = '';

        for (const location of data.results) { // Recorre las ubicaciones obtenidas
            const residentNames = await fetchResidentNames(location.residents); // Obtiene los nombres de los residentes de la ubicación
            html += generateLocationCard(location, residentNames); // Genera la tarjeta de la ubicación con los nombres de los residentes
        }

        container.innerHTML = html; // Actualiza el contenido del contenedor con las tarjetas generadas
    } catch (err) {
        console.error(err); // Maneja cualquier error y lo muestra en la consola
    }
};

// Agrega opciones al select de páginas
const selectPage = document.getElementById('select');
for (let i = 1; i < 8; i++) { // Crea opciones para 7 páginas de ubicaciones
    const option = document.createElement('option');
    option.value = i;
    option.text = i;
    option.className = 'page-link';
    selectPage.appendChild(option);
}

// Agrega opciones al select de búsqueda por ID de ubicación
const selectCharacter = document.getElementById('select_one_location');
for (let i = 1; i < 127; i++) { // Crea opciones para 126 ubicaciones (máximo ID conocido)
    const option = document.createElement('option');
    option.value = i;
    option.text = i;
    option.className = 'page-link';
    selectCharacter.appendChild(option);
}

// Evento al cambiar la selección en el select de páginas
selectPage.addEventListener('change', async () => {
    const value = selectPage.value;
    await getPage(value); // Obtiene la página seleccionada
});

// Evento al cambiar la selección en el select de búsqueda por ID de ubicación
selectCharacter.addEventListener('change', async () => {
    const value = selectCharacter.value;
    await getOneLocation(value); // Obtiene la ubicación seleccionada
});

// Función para obtener una ubicación específica por su ID
const getOneLocation = async (id) => {
    const container = document.querySelector('.container'); // Contenedor donde se mostrará la ubicación
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/location/${id}`); // Obtiene los datos de la ubicación por su ID
        const card = await response.json(); // Convierte la respuesta en formato JSON

        const residentNames = await fetchResidentNames(card.residents); // Obtiene los nombres de los residentes de la ubicación
        const html = generateLocationCard(card, residentNames); // Genera la tarjeta de la ubicación con los nombres de los residentes

        container.innerHTML = html; // Actualiza el contenido del contenedor con la tarjeta generada
    } catch (err) {
        console.error(err); // Maneja cualquier error y lo muestra en la consola
    }
};

// Evento al escribir en el campo de filtro
const inputFilter = document.querySelector('.filter');
inputFilter.addEventListener('input', () => {
    const filterValue = inputFilter.value;
    filterCharactersByName(filterValue); // Filtra las ubicaciones por nombre
});

// Función para filtrar ubicaciones por nombre
const filterCharactersByName = async (name) => {
    const container = document.querySelector('.container'); // Contenedor donde se mostrarán las ubicaciones
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/location/?name=${name}`); // Obtiene los datos de las ubicaciones filtradas por nombre
        const data = await response.json(); // Convierte la respuesta en formato JSON

        if (data.error) {
            container.innerHTML = `<p>No se encontraron ubicaciones con ese nombre.</p>`; // Muestra un mensaje si no se encuentran ubicaciones
            return;
        }

        let html = '';

        for (const location of data.results) { // Recorre las ubicaciones obtenidas
            const residentNames = await fetchResidentNames(location.residents); // Obtiene los nombres de los residentes de la ubicación
            html += generateLocationCard(location, residentNames); // Genera la tarjeta de la ubicación con los nombres de los residentes
        }

        container.innerHTML = html; // Actualiza el contenido del contenedor con las tarjetas generadas
    } catch (err) {
        console.error(err); // Maneja cualquier error y lo muestra en la consola
        container.innerHTML = `<p>Error al cargar las ubicaciones.</p>`; // Muestra un mensaje de error si no se pueden cargar las ubicaciones
    }
};


