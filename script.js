// Datos de las zonas (esto lo puedes ampliar tú mismo)
const datosZonas = {
    pueblo: {
        titulo: "El Pueblo Maldito",
        partes: [
            { nombre: "Plaza Mayor", desc: "Donde comenzó la pesadilla." },
            { nombre: "La Iglesia", desc: "Un refugio que no parece seguro." }
        ]
    },
    castillo: {
        titulo: "Castillo de los Requiem",
        partes: [
            { nombre: "Mazmorras", desc: "Humedad, sangre y cadenas." },
            { nombre: "Salón del Trono", desc: "Cuidado con las sombras." }
        ]
    }
};

let contadorMuertes = 0;

function irAZona(idZona) {
    const zona = datosZonas[idZona];
    const detalle = document.getElementById('contenido-zona');
    
    // Construimos el contenido dinámicamente 
    detalle.innerHTML = `
        <h2 class="titulo-seccion">${zona.titulo}</h2>
        ${zona.partes.map(parte => `
            <div class="parte-zona">
                <h4>${parte.nombre}</h4>
                <p>${parte.desc}</p>
                <button class="btn-muerte" onclick="registrarMuerte('${parte.nombre}')">
                    Morir aquí
                </button>
            </div>
        `).join('')}
    `;

    // Cambiamos de vista [cite: 21, 27]
    document.getElementById('vista-home').classList.add('oculto');
    document.getElementById('vista-detalle').classList.remove('oculto');
    document.getElementById('vista-detalle').classList.add('fade-in');
}

function volverAHome() {
    document.getElementById('vista-detalle').classList.add('oculto');
    document.getElementById('vista-home').classList.remove('oculto');
}

function registrarMuerte(subZona) {
    contadorMuertes++;
    document.getElementById('total-muertes').textContent = contadorMuertes;
    
    const li = document.createElement('li');
    li.textContent = `Caído en: ${subZona}`;
    document.getElementById('lista-muertes').appendChild(li);
}