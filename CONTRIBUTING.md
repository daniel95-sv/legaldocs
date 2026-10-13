# Guía de Contribución

¡Gracias por tu interés en colaborar con **LegalDocs Generator**!

## Principios del Proyecto

1. **Claridad y modularidad:** Mantener el motor de generación desacoplado de la interfaz gráfica.
2. **Sin sobreingeniería:** No incorporar dependencias pesadas ni frameworks innecesarios si la funcionalidad puede resolverse con TypeScript estándar y CSS moderno.
3. **Privacidad absoluta:** Ninguna funcionalidad debe enviar datos de los formularios a servicios externos.

## Pasos para Contribuir

1. Haz un fork del repositorio y crea una rama descriptiva (`git checkout -b feature/nueva-plantilla`).
2. Instala dependencias con `npm install`.
3. Realiza tus cambios asegurándote de que el código compila limpiamente (`npm run typecheck`).
4. Añade pruebas unitarias para cualquier nueva regla o plantilla en `tests/unit/`.
5. Ejecuta las pruebas: `npm test`.
6. Realiza tu commit y envía un Pull Request detallando los cambios.
