# ⚡ Instrucciones Rápidas de Configuración

## 🔧 Pasos Esenciales para Configurar OneSignal

### 1. Obtener App ID de OneSignal

1. Ve a https://onesignal.com y crea una cuenta
2. Crea una nueva app → **"Web Push"**
3. Ve a **Settings** → **Keys & IDs**
4. Copia el **OneSignal App ID**

### 2. Configurar en el código

Abre `app.js` y busca esta línea (alrededor de la línea 39):

```javascript
const ONESIGNAL_APP_ID = 'TU_ONESIGNAL_APP_ID';
```

Reemplázala con tu App ID:

```javascript
const ONESIGNAL_APP_ID = 'tu-app-id-real-aqui';
```

### 3. Crear los iconos

Necesitas crear dos archivos de iconos:
- `icon-192.png` (192x192 píxeles)
- `icon-512.png` (512x512 píxeles)

Puedes usar herramientas online como:
- https://realfavicongenerator.net/
- https://www.favicon-generator.org/
- https://www.canva.com/

### 4. Iniciar el servidor

```bash
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node.js (http-server)
http-server -p 8000

# Opción 3: VS Code Live Server
```

Abre: `http://localhost:8000`

### 5. Probar la aplicación

1. Abre la app en el navegador
2. Haz clic en **"Activar Notificaciones"** y acepta los permisos
3. Haz clic en **"Enviar Frase Filosófica"** para probar

## ⚠️ Importante

- **HTTPS obligatorio en producción**: Las notificaciones push requieren HTTPS
- **El botón "Enviar" solo muestra notificación local**: Para enviar a todos los usuarios, usa la API REST de OneSignal desde tu servidor (ver README.md)

## 📝 Enviar a Todos los Usuarios

El botón "Enviar Frase Filosófica" en la interfaz solo es una demostración. Para enviar a todos los usuarios suscritos, usa la API REST de OneSignal:

1. Ve a **Settings** → **Keys & IDs** en OneSignal
2. Copia tu **REST API Key**
3. Usa la API REST para enviar (ver README.md para ejemplos)

---

**¿Necesitas más ayuda?** Revisa el `README.md` completo para instrucciones detalladas.
