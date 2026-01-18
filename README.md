# 🧠 PWA de Frases Filosóficas

Aplicación web progresiva (PWA) que permite a los usuarios suscribirse a notificaciones push y recibir frases filosóficas aleatorias. La aplicación incluye un botón de instalación para dispositivos móviles y de escritorio.

## ✨ Características

- ✅ **Instalable como PWA** - Botón de instalación para móvil y escritorio
- 🔔 **Notificaciones Push** - Integración con OneSignal
- 📱 **Diseño Responsivo** - Funciona en todos los dispositivos
- 🌐 **Modo Offline** - Funciona sin conexión a internet
- 🎨 **Interfaz Moderna** - Diseño limpio y minimalista

## 📋 Requisitos Previos

- Servidor web (HTTP/HTTPS) - Las PWAs requieren HTTPS en producción
- Cuenta en [OneSignal](https://onesignal.com/) (gratuita)
- Navegador moderno que soporte PWA

## 🚀 Configuración de OneSignal

### Paso 1: Crear cuenta en OneSignal

1. Ve a [https://onesignal.com/](https://onesignal.com/)
2. Crea una cuenta gratuita
3. Inicia sesión en el dashboard

### Paso 2: Crear una nueva aplicación

1. En el dashboard, haz clic en **"New App/Website"**
2. Selecciona **"Web Push"**
3. Completa la información:
   - **Name**: "Frases Filosóficas" (o el nombre que prefieras)
   - **Website URL**: La URL donde alojarás tu PWA (ej: `https://tudominio.com`)
   - **Permission Prompt Settings**: Configura según tus preferencias

### Paso 3: Obtener el App ID

1. Una vez creada la app, ve a **Settings** → **Keys & IDs**
2. Copia el **OneSignal App ID** (algo como: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Paso 4: Configurar el código

1. Abre el archivo `app.js`
2. Busca la línea que dice:
   ```javascript
   const ONESIGNAL_APP_ID = 'TU_ONESIGNAL_APP_ID';
   ```
3. Reemplaza `'TU_ONESIGNAL_APP_ID'` con tu App ID de OneSignal:
   ```javascript
   const ONESIGNAL_APP_ID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
   ```

### Paso 5: Configurar el Service Worker de OneSignal

El SDK de OneSignal ya está incluido en el HTML y se carga desde el CDN. El Service Worker (`sw.js`) está configurado para trabajar con OneSignal.

**Importante**: Si OneSignal requiere un Service Worker específico, puedes:

1. Ir a **Settings** → **Platforms** → **Web Push**
2. Descargar el Service Worker personalizado de OneSignal
3. Reemplazar `sw.js` con el archivo descargado, o
4. Combinar ambos Service Workers si necesitas funcionalidades de ambos

### Paso 6: Configurar la URL del sitio

En OneSignal Dashboard:
1. Ve a **Settings** → **Platforms** → **Web Push**
2. Asegúrate de que la **Website URL** coincida con la URL donde alojarás la aplicación
3. Para desarrollo local, puedes usar `http://localhost` (pero necesitarás configurar HTTPS para producción)

## 📁 Estructura del Proyecto

```
notificaciones/
├── index.html          # Interfaz principal
├── style.css           # Estilos de la aplicación
├── app.js              # Lógica principal (aquí configuras OneSignal)
├── sw.js               # Service Worker (notificaciones y offline)
├── manifest.json       # Configuración de la PWA
├── icon-192.png        # Icono 192x192 (necesitas crearlo)
├── icon-512.png        # Icono 512x512 (necesitas crearlo)
└── README.md           # Este archivo
```

## 🎨 Crear los Iconos

Necesitas crear dos iconos para la PWA:

1. **icon-192.png** - 192x192 píxeles
2. **icon-512.png** - 512x512 píxeles

Puedes usar herramientas como:
- [Favicon Generator](https://realfavicongenerator.net/)
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- Cualquier editor de imágenes

**Recomendación**: Usa un icono relacionado con filosofía, libros, o cerebro.

## 🛠️ Instalación Local

### Opción 1: Servidor HTTP simple (Python)

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Luego abre: `http://localhost:8000`

### Opción 2: Servidor HTTP simple (Node.js)

```bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar servidor
http-server -p 8000
```

Luego abre: `http://localhost:8000`

### Opción 3: Live Server (VS Code)

Si usas VS Code, instala la extensión "Live Server" y haz clic derecho en `index.html` → "Open with Live Server"

**Nota**: Para que las notificaciones funcionen completamente, necesitarás HTTPS. Para desarrollo local con HTTPS, puedes usar herramientas como [mkcert](https://github.com/FiloSottile/mkcert) o servicios como [ngrok](https://ngrok.com/).

## 🚀 Despliegue en Producción

### Requisitos para Producción:

1. **HTTPS obligatorio** - Las notificaciones push requieren HTTPS
2. **Configurar OneSignal** con la URL de producción
3. **Actualizar el App ID** en `app.js` si usas diferentes ambientes

### Opciones de hosting gratuitas:

- **Vercel** - [https://vercel.com](https://vercel.com)
- **Netlify** - [https://netlify.com](https://netlify.com)
- **GitHub Pages** - Requiere configuración adicional para HTTPS
- **Firebase Hosting** - [https://firebase.google.com](https://firebase.google.com)

## 📱 Envío de Notificaciones Push a Todos los Usuarios

Para enviar notificaciones a todos los usuarios suscritos, necesitas usar la **API REST de OneSignal**. El botón "Enviar Frase Filosófica" en la interfaz solo envía una notificación local como demostración.

### Usar la API REST de OneSignal:

1. Ve a **Settings** → **Keys & IDs** en OneSignal
2. Copia tu **REST API Key**

### Ejemplo de envío desde un servidor (Node.js):

```javascript
const https = require('https');

const ONESIGNAL_APP_ID = 'TU_ONESIGNAL_APP_ID';
const ONESIGNAL_REST_API_KEY = 'TU_REST_API_KEY';

const frase = {
  texto: "La vida no examinada no vale la pena ser vivida",
  autor: "Sócrates"
};

const notification = {
  app_id: ONESIGNAL_APP_ID,
  contents: { en: frase.texto },
  headings: { en: `🧠 ${frase.autor}` },
  included_segments: ['All'], // Enviar a todos los usuarios
  url: 'https://tudominio.com'
};

const options = {
  host: 'onesignal.com',
  port: 443,
  path: '/api/v1/notifications',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
  }
};

const req = https.request(options, (res) => {
  res.on('data', (data) => {
    console.log(JSON.parse(data));
  });
});

req.write(JSON.stringify(notification));
req.end();
```

### O desde el Dashboard de OneSignal:

1. Ve a **Messages** → **New Push**
2. Configura el mensaje
3. Selecciona la audiencia (All Users)
4. Envía

## 🧪 Probar la Aplicación

1. Abre la aplicación en el navegador
2. Haz clic en **"Instalar Aplicación"** (si aparece)
3. Haz clic en **"Activar Notificaciones"** y acepta los permisos
4. Haz clic en **"Enviar Frase Filosófica"** para probar
5. Verifica que recibas la notificación

## 🐛 Solución de Problemas

### Las notificaciones no funcionan:
- ✅ Verifica que tengas HTTPS (en producción)
- ✅ Verifica que el App ID de OneSignal esté correcto
- ✅ Verifica que el navegador permita notificaciones
- ✅ Revisa la consola del navegador para errores

### El botón de instalación no aparece:
- ✅ Verifica que estés usando HTTPS
- ✅ Verifica que `manifest.json` esté correcto
- ✅ Verifica que el Service Worker esté registrado
- ✅ Intenta desde Chrome/Edge en móvil o escritorio

### OneSignal no se inicializa:
- ✅ Verifica que el script de OneSignal se cargue correctamente
- ✅ Revisa la consola para errores de red
- ✅ Verifica que el App ID sea correcto

## 📝 Notas Adicionales

- El botón "Enviar Frase Filosófica" en la interfaz es solo una demostración. Para enviar a todos los usuarios, usa la API REST de OneSignal desde tu servidor.
- Las notificaciones push solo funcionan en navegadores compatibles (Chrome, Firefox, Edge, Safari).
- En iOS, las notificaciones push requieren iOS 16.4+ y Safari.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request si tienes sugerencias o mejoras.

---

**Desarrollado con ❤️ como PWA usando OneSignal**
