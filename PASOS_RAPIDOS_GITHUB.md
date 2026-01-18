# ⚡ Pasos Rápidos: GitHub Pages + OneSignal

## 🚀 Configuración en 5 Minutos

### 1️⃣ Subir tu código a GitHub

```bash
git init
git add .
git commit -m "PWA de Frases Filosóficas"
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

### 2️⃣ Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. **Settings** → **Pages**
3. **Source**: `main` branch, `/ (root)`
4. **Save**
5. Espera 2-3 minutos
6. Tu URL será: `https://TU_USUARIO.github.io/TU_REPOSITORIO/`

### 3️⃣ Configurar OneSignal

1. Ve a https://onesignal.com
2. Crea una cuenta o inicia sesión
3. **New App/Website** → **Web Push**
4. Configura:
   - **Name**: "Frases Filosóficas"
   - **Website URL**: `https://TU_USUARIO.github.io/TU_REPOSITORIO` (sin barra final)
5. Ve a **Settings** → **Keys & IDs**
6. Copia el **OneSignal App ID**

### 4️⃣ Configurar tu App ID

1. Edita `app.js` (línea ~60)
2. Reemplaza:
   ```javascript
   const ONESIGNAL_APP_ID = 'TU_ONESIGNAL_APP_ID';
   ```
   Por:
   ```javascript
   const ONESIGNAL_APP_ID = 'tu-app-id-de-onesignal';
   ```

### 5️⃣ Crear los iconos

Necesitas crear:
- `icon-192.png` (192x192 px)
- `icon-512.png` (512x512 px)

Usa: https://realfavicongenerator.net/ o cualquier editor de imágenes

### 6️⃣ Subir cambios

```bash
git add .
git commit -m "Configurar OneSignal"
git push
```

### 7️⃣ Probar

1. Abre: `https://TU_USUARIO.github.io/TU_REPOSITORIO/`
2. Haz clic en **"Activar Notificaciones"**
3. Acepta los permisos
4. ¡Listo! 🎉

## ✅ Checklist

- [ ] Código subido a GitHub
- [ ] GitHub Pages habilitado
- [ ] OneSignal configurado con la URL correcta
- [ ] App ID actualizado en `app.js`
- [ ] Iconos creados (`icon-192.png`, `icon-512.png`)
- [ ] Cambios subidos a GitHub
- [ ] Aplicación probada y funcionando

## 🔍 Verificar

1. Abre DevTools (F12) → Console
2. Deberías ver: `OneSignal inicializado`
3. En DevTools → Application → Service Workers, verifica que esté registrado

## 🐛 Problemas Comunes

### "OneSignal no se inicializa"
- ✅ Verifica que el App ID sea correcto
- ✅ Verifica que la URL en OneSignal coincida exactamente con GitHub Pages

### "Service Worker no se registra"
- ✅ Verifica que `sw.js` esté en la raíz del repositorio
- ✅ El código detecta automáticamente la ruta, no deberías tener problemas

### "404 en recursos"
- ✅ Verifica que todos los archivos estén en la raíz del repo
- ✅ Verifica que los nombres de archivo coincidan exactamente

---

**¿Necesitas ayuda?** Revisa `CONFIGURACION_GITHUB_PAGES.md` para instrucciones detalladas.
