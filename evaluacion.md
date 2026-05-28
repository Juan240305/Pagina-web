**Evaluación: Juan García / Pagina-web**

**Estado:** Evaluable

**Nota:** 8.90/10

**Desglose:**
- Ejecución y estabilidad: 18/20
- Front-end: 13/15
- Back-end: 13/15
- Funcionalidades: 18/20
- Responsive: 9/10
- Tipografías: 5/5
- Animación: 5/5
- Documentación: 8/10
- Repositorio: 4/5
**Funcionalidades indicadas:**
- Pantalla de registro con validación y sesión en `sessionStorage`.
- Animación de puerta Umbrella al entrar.
- Grid dinámico de capítulos/áreas generado desde JavaScript.
- Buscador de áreas en tiempo real.
- Modal de zonas con imágenes y descripciones.
- aracker de progreso por zona con `localStorage`.
- Reporte de muertes con modal, guardado local y notificación externa.
- Integración con EmailJS.
- Webhook de Discord.
- Enlaces a comunidad de WhatsApp y Discord.
- Scroll reveal con `IntersectionObserver`.

**Resumen técnico:**
La web está publicada y funciona en `https://juan240305.github.io/Pagina-web/`. También carga correctamente en local, y el `script.js` pasa validación sintáctica. El proyecto tiene una estética muy marcada de Resident Evil/Umbrella, bastante contenido y una experiencia coherente: registro inicial, áreas generadas por datos, progreso persistente, modales y reportes.

El frontend está bien trabajado y tiene detalles visuales con intención: puerta de acceso, franjas rojas al abrir/cerrar zonas, tarjetas, buscador y responsive con varios breakpoints. Se nota esfuerzo en hacer que la página parezca una guía interactiva y no solo una landing estática.

El backend no es un servidor propio, pero sí hay integraciones externas reales: EmailJS y Discord webhook. Eso aporta funcionalidad, aunque tiene una limitación importante: las credenciales y el webhook están expuestos en el frontend, por lo que no es una solución segura para producción.

**Puntos fuertes:**
Enhorabuena por el diseño, la ambientación y la cantidad de funcionalidades. La página tiene personalidad y muy buen ritmo visual.

**Aspectos a mejorar:**
Proteger credenciales moviendo EmailJS/Discord a un backend real, corregir caracteres mal codificados y evitar llamar “backend” a lógica sensible ejecutada solo en navegador.

**Retroalimentación:**
Muy buen trabajo. La web transmite muy bien el tema elegido y tiene funcionalidades útiles. Con un pequeño backend que oculte las claves y gestione los reportes, subiría claramente de nivel técnico.
