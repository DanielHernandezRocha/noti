# 🚀 Configuración de OneSignal con GitHub Pages

Esta guía te ayudará a configurar tu PWA de Frases Filosóficas con OneSignal usando GitHub Pages.

## 📋 Paso a Paso

### Paso 1: Preparar el Repositorio en GitHub

1. Crea un nuevo repositorio en GitHub (o usa uno existente)
2. Sube todos los archivos del proyecto:
   - `index.html`
   - `style.css`
   - `app.js`
   - `sw.js`
   - `manifest.json`
   - `icon-192.png` (crear primero)
   - `icon-512.png` (crear primero)

### Paso 2: Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, busca **Pages**
4. En **Source**, selecciona:
   - **Branch**: `main` (o `master` según tu rama principal)
   - **Folder**: `/ (root)` o la carpeta donde está tu `index.html`
5. Haz clic en **Save**
6. Espera unos minutos y tu sitio estará disponible en:
   - `https://TU_USUARIO.github.io/TU_REPOSITORIO/`
   - Ejemplo: `https://hector123.github.io/notificaciones/`

### Paso 3: Configurar OneSignal

1. **Ve a OneSignal Dashboard**: https://onesignal.com/

2. **Crea o selecciona tu app**:
   - Si no tienes una, crea una nueva → **"Web Push"**
   - Si ya tienes una, selecciónala

3. **Configura la URL del sitio**:
   - Ve a **Settings** → **Platforms** → **Web Push**
   - En **Site URL**, ingresa tu URL de GitHub Pages:
     ```
     https://TU_USUARIO.github.io/TU_REPOSITORIO
     ```
     **Ejemplo**: `https://hector123.github.io/notificaciones`
   
   ⚠️ **IMPORTANTE**: 
   - Debe ser HTTPS (GitHub Pages ya lo proporciona)
   - No incluyas la barra final `/`
   - Debe coincidir exactamente con la URL donde está desplegada tu app

4. **Obtén tu App ID**:
   - Ve a **Settings** → **Keys & IDs**
   - Copia el **OneSignal App ID** (algo como: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Paso 4: Configurar el Código

1. **Edita `app.js`** en tu repositorio local

2. Busca la línea que dice (alrededor de la línea 60):
   ```javascript
   const ONESIGNAL_APP_ID = 'TU_ONESIGNAL_APP_ID';
   ```

3. Reemplázala con tu App ID real:
   ```javascript
   const ONESIGNAL_APP_ID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
   ```

4. ✅ **¡Buenas noticias!** El código ya está configurado para detectar automáticamente la ruta base, así que funcionará tanto si tu repositorio está en la raíz (`usuario.github.io`) como en una subcarpeta (`usuario.github.io/repositorio`).

   - El código detecta automáticamente la ruta base desde `window.location.pathname`
   - El Service Worker se registra con la ruta correcta automáticamente
   - Las rutas de los recursos se ajustan automáticamente

   **No necesitas cambiar nada más en el código.** Solo configura tu App ID de OneSignal y listo.

### Paso 7: Subir los Cambios

1. Guarda todos los cambios
2. Haz commit y push a GitHub:
   ```bash
   git add .
   git commit -m "Configurar OneSignal para GitHub Pages"
   git push origin main
   ```

3. Espera unos minutos a que GitHub Pages actualice el sitio

### Paso 8: Verificar la Configuración

1. Abre tu sitio en GitHub Pages: `https://TU_USUARIO.github.io/TU_REPOSITORIO/`
2. Abre las **DevTools** (F12) → **Console**
3. Deberías ver: `OneSignal inicializado`
4. Haz clic en **"Activar Notificaciones"** y acepta los permisos
5. Verifica que recibas una confirmación de suscripción

### Paso 9: Probar las Notificaciones

1. **Notificación local**: Haz clic en "Enviar Frase Filosófica" (funciona inmediatamente)
2. **Notificación desde OneSignal Dashboard**:
   - Ve a **Messages** → **New Push**
   - Escribe tu mensaje
   - Selecciona **All Users** como audiencia
   - Haz clic en **Send Message**

## 🔧 Configuración Automática (Script)

Si quieres automatizar el cambio de rutas, aquí tienes un script que actualizará `app.js` automáticamente:

### Crear `update-paths.js`:

```javascript
const fs = require('fs');
const REPO_NAME = process.argv[2] || 'notificaciones'; // Usa el argumento o 'notificaciones' por defecto

// Leer app.js
let appJs = fs.readFileSync('app.js', 'utf8');

// Actualizar rutas del Service Worker
appJs = appJs.replace(
    /const registration = await navigator\.serviceWorker\.register\('\/sw\.js'/,
    `const registration = await navigator.serviceWorker.register('/${REPO_NAME}/sw.js'`
);

// Actualizar scope
appJs = appJs.replace(
    /scope: '\/'/,
    `scope: '/${REPO_NAME}/'`
);

// Guardar
fs.writeFileSync('app.js', appJs);
console.log(`✅ Rutas actualizadas para repositorio: ${REPO_NAME}`);
```

Ejecutar: `node update-paths.js nombre-de-tu-repo`

## ⚠️ Solución de Problemas Comunes

### El Service Worker no se registra:
- ✅ Verifica que el archivo `sw.js` esté en la raíz del repositorio
- ✅ Verifica que la ruta en `registerServiceWorker()` coincida con la estructura de tu repo
- ✅ Abre DevTools → Application → Service Workers y verifica errores

### OneSignal no se inicializa:
- ✅ Verifica que el App ID sea correcto
- ✅ Verifica que la URL en OneSignal coincida exactamente con tu GitHub Pages URL
- ✅ Revisa la consola del navegador para errores de CORS

### Las notificaciones no llegan:
- ✅ Verifica que estés suscrito (botón debe decir "Notificaciones Activadas")
- ✅ Verifica que el navegador permita notificaciones
- ✅ En OneSignal Dashboard, ve a **Audience** → **All Users** y verifica que aparezcas

### 404 en los recursos:
- ✅ Verifica que todos los archivos estén en la raíz del repositorio
- ✅ Verifica que los nombres de archivo coincidan exactamente (case-sensitive)

## 📝 Checklist Final

- [ ] Repositorio creado en GitHub
- [ ] Archivos subidos al repositorio
- [ ] GitHub Pages habilitado
- [ ] URL de GitHub Pages obtenida
- [ ] OneSignal configurado con la URL correcta
- [ ] App ID copiado de OneSignal
- [ ] App ID actualizado en `app.js`
- [ ] Rutas del Service Worker ajustadas (si es necesario)
- [ ] Cambios subidos a GitHub
- [ ] Sitio probado en GitHub Pages
- [ ] Notificaciones probadas y funcionando

## 🎉 ¡Listo!

Tu PWA debería estar funcionando en GitHub Pages con OneSignal. Los usuarios podrán:
- Instalar la aplicación en sus dispositivos
- Suscribirse a notificaciones
- Recibir frases filosóficas

**URL de tu sitio**: `https://TU_USUARIO.github.io/TU_REPOSITORIO/`

---

**Nota**: Si cambias el nombre del repositorio, recuerda actualizar la URL en OneSignal y las rutas en el código.
