// Evento que se dispara cuando el DOM se ha cargado
document.addEventListener('DOMContentLoaded', async () => {
    const id = 1; // ID de la página inicial
    await getPage(id); // Obtiene la primera página de episodios al cargar la página
  });
  
  // Crea opciones para el select de páginas de episodios
  const selectPage = document.getElementById('select');
  for (let i = 1; i < 4; i++) { // Crea opciones para 3 páginas de episodios
    const option = document.createElement('option');
    option.value = i;
    option.text = i;
    option.className = 'page-link';
    selectPage.appendChild(option);
  }
  
  // Crea opciones para el select de búsqueda por ID de episodio
  const selectCharacter = document.getElementById('select_one_episode');
  for (let i = 1; i < 52; i++) { // Crea opciones para 51 episodios (máximo ID conocido)
    const option = document.createElement('option');
    option.value = i;
    option.text = i;
    option.className = 'page-link';
    selectCharacter.appendChild(option);
  }
  
  // Evento al cambiar la selección en el select de páginas de episodios
  selectPage.addEventListener('change', async () => {
    const value = selectPage.value;
    await getPage(value); // Obtiene la página seleccionada
  });
  
  // Función para obtener una página de episodios
  const getPage = async (id) => {
    const container = document.querySelector('.container'); // Contenedor donde se mostrarán los episodios
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/episode?page=${id}`); // Obtiene los datos de la página de episodios
        const data = await response.json(); // Convierte la respuesta en formato JSON
  
        let html = '';
  
        data.results.forEach(card => { // Recorre los episodios obtenidos
            html += generateCharacterCard(card); // Genera la tarjeta de cada episodio
        });
  
        container.innerHTML = html; // Actualiza el contenido del contenedor con las tarjetas generadas
    } catch (err) {
        console.error(err); // Maneja cualquier error y lo muestra en la consola
    }
  };
  
  // Evento al cambiar la selección en el select de búsqueda por ID de episodio
  selectCharacter.addEventListener('change', async () => {
    const value = selectCharacter.value;
    await getOneCharacter(value); // Obtiene el episodio seleccionado
  });
  
  // Función para obtener un episodio específico por su ID
  const getOneCharacter = async (id) => {
    const container = document.querySelector('.container'); // Contenedor donde se mostrará el episodio
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/episode/${id}`); // Obtiene los datos del episodio por su ID
        const card = await response.json(); // Convierte la respuesta en formato JSON
  
        const html = generateCharacterCard(card); // Genera la tarjeta del episodio
  
        container.innerHTML = html; // Actualiza el contenido del contenedor con la tarjeta generada
    } catch (err) {
        console.error(err); // Maneja cualquier error y lo muestra en la consola
    }
  };
  
  // Evento al escribir en el campo de filtro
  const inputFilter = document.querySelector('.filter');
  inputFilter.addEventListener('input', () => {
    const filterValue = inputFilter.value;
    filterCharactersByName(filterValue); // Filtra los episodios por nombre
  });
  
  // Función para filtrar episodios por nombre
  const filterCharactersByName = async (name) => {
    const container = document.querySelector('.container'); // Contenedor donde se mostrarán los episodios
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/episode/?name=${name}`); // Obtiene los datos de los episodios filtrados por nombre
        const data = await response.json(); // Convierte la respuesta en formato JSON
  
        if (data.error) {
            container.innerHTML = `<p>No se encontraron episodios con ese nombre.</p>`; // Muestra un mensaje si no se encuentran episodios
            return;
        }
  
        const characterCards = data.results.map(card => generateCharacterCard(card)).join(''); // Genera las tarjetas de los episodios
        container.innerHTML = characterCards; // Actualiza el contenido del contenedor con las tarjetas generadas
    } catch (err) {
        console.error(err); // Maneja cualquier error y lo muestra en la consola
        container.innerHTML = `<p>Error al cargar los episodios.</p>`; // Muestra un mensaje de error si no se pueden cargar los episodios
    }
  };
  
  // Función para generar la tarjeta de un episodio
  const generateCharacterCard = (card) => {
    return `
        <div class="container-card">
            <img src="img/rick-morty-critica.jpeg" alt="image of port" class="image">
            <div class="container-text">
                <h3>${card.name}</h3>
                <p>${card.episode} - ${card.air_date}</p>
                <div class="container3">
                    <div class="container-info">
                        <p><span>URL:</span> <a href="${card.url}" target="_blank">${card.url}</a></p>
                        <p><span>CREATED:</span>${card.created}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
  };
  