// Frases filosóficas
const frasesFilosoficas = [
    { texto: "La vida no examinada no vale la pena ser vivida", autor: "Sócrates" },
    { texto: "Pienso, luego existo", autor: "René Descartes" },
    { texto: "No se puede bañarse dos veces en el mismo río", autor: "Heráclito" },
    { texto: "La felicidad es el sentido y propósito de la vida", autor: "Aristóteles" },
    { texto: "Dios ha muerto", autor: "Friedrich Nietzsche" },
    { texto: "El hombre está condenado a ser libre", autor: "Jean-Paul Sartre" },
    { texto: "Solo sé que no sé nada", autor: "Sócrates" },
    { texto: "La verdad está en el mundo, no en mi cabeza", autor: "Ludwig Wittgenstein" },
    { texto: "El ser es y el no ser no es", autor: "Parménides" },
    { texto: "La filosofía es un saber de segundo grado", autor: "Karl Jaspers" },
    { texto: "El destino de los hombres está hecho de momentos felices", autor: "Platón" },
    { texto: "La conciencia determina la vida, no la vida la conciencia", autor: "Karl Marx" },
    { texto: "Todo fluye, nada permanece", autor: "Heráclito" },
    { texto: "El hombre es la medida de todas las cosas", autor: "Protágoras" },
    { texto: "No hay un hecho, solo interpretaciones", autor: "Friedrich Nietzsche" }
];

// Variables globales
let deferredPrompt = null;
let isOneSignalInitialized = false;
let oneSignalInstance = null;

// Detectar ruta base automáticamente para GitHub Pages
function getBasePath() {
    const path = window.location.pathname;
    // Si la ruta es solo '/' o termina en index.html, está en la raíz
    if (path === '/' || path.endsWith('index.html') || path.endsWith('/')) {
        return '/';
    }
    // Extraer el nombre del repositorio de la ruta
    // Ejemplo: /notificaciones/ -> /notificaciones/
    const parts = path.split('/').filter(p => p && p !== 'index.html');
    if (parts.length > 0) {
        return '/' + parts[0] + '/';
    }
    return '/';
}

const BASE_PATH = getBasePath();
console.log('Ruta base detectada:', BASE_PATH);

// Verificar si la app está instalada
function checkIfInstalled() {
    // Verificar si está en modo standalone (instalada)
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://')) {
        document.getElementById('installedStatus').style.display = 'block';
        document.getElementById('installSection').style.display = 'none';
        return true;
    }
    return false;
}

// Registrar Service Worker
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            // Usar ruta base para GitHub Pages
            const swPath = BASE_PATH === '/' ? '/sw.js' : BASE_PATH + 'sw.js';
            const registration = await navigator.serviceWorker.register(swPath, {
                scope: BASE_PATH
            });
            console.log('Service Worker registrado:', registration);
            return registration;
        } catch (error) {
            console.error('Error al registrar Service Worker:', error);
            return null;
        }
    }
    return null;
}

// Inicializar OneSignal
function initializeOneSignal() {
    // Reemplaza 'TU_APP_ID' con tu App ID de OneSignal
    const ONESIGNAL_APP_ID = 'TU_ONESIGNAL_APP_ID'; // ⚠️ CAMBIAR ESTO
    
    if (typeof OneSignal !== 'undefined') {
        oneSignalInstance = window.OneSignal || window.OneSignalSDK;
        
        // Configurar Service Worker path para GitHub Pages
        const swPath = BASE_PATH === '/' ? 'sw.js' : BASE_PATH + 'sw.js';
        
        oneSignalInstance.init({
            appId: ONESIGNAL_APP_ID,
            notifyButton: {
                enable: false
            },
            allowLocalhostAsSecureOrigin: true,
            serviceWorkerParam: { scope: BASE_PATH },
            serviceWorkerPath: swPath,
            welcomeNotification: {
                disable: true
            }
        });

        oneSignalInstance.on('subscriptionChange', function(isSubscribed) {
            updateSubscriptionUI(isSubscribed);
        });

        isOneSignalInitialized = true;
        console.log('OneSignal inicializado');
        checkSubscriptionStatus();
    } else {
        console.error('OneSignal SDK no está cargado');
        setTimeout(initializeOneSignal, 500);
    }
}

// Verificar estado de suscripción
async function checkSubscriptionStatus() {
    if (!isOneSignalInitialized) return;

    try {
        const isSubscribed = await oneSignalInstance.isPushNotificationsEnabled();
        updateSubscriptionUI(isSubscribed);
    } catch (error) {
        console.error('Error al verificar suscripción:', error);
    }
}

// Actualizar UI de suscripción
function updateSubscriptionUI(isSubscribed) {
    const subscribeBtn = document.getElementById('subscribeBtn');
    const subscriptionStatus = document.getElementById('subscriptionStatus');
    const subscriptionStatusText = document.getElementById('subscriptionStatusText');
    const sendBtn = document.getElementById('sendNotificationBtn');

    if (isSubscribed) {
        subscribeBtn.textContent = '✅ Notificaciones Activadas';
        subscribeBtn.disabled = true;
        subscriptionStatus.style.display = 'block';
        subscriptionStatusText.textContent = '🔔 Suscrito a notificaciones';
        sendBtn.disabled = false;
    } else {
        subscribeBtn.textContent = '🔔 Activar Notificaciones';
        subscribeBtn.disabled = false;
        subscriptionStatus.style.display = 'none';
        sendBtn.disabled = true;
    }
}

// Suscribir a notificaciones
async function subscribeToNotifications() {
    if (!isOneSignalInitialized) {
        alert('OneSignal aún no está inicializado. Por favor, espera un momento.');
        return;
    }

    try {
        showLoading(true);
        
        // Solicitar permisos y suscribir
        await oneSignalInstance.registerForPushNotifications();
        
        // Esperar un momento para que se complete la suscripción
        setTimeout(() => {
            checkSubscriptionStatus();
            showLoading(false);
            showQuote('🎉 ¡Suscripción exitosa!', 'Ahora recibirás frases filosóficas');
        }, 1000);
        
    } catch (error) {
        console.error('Error al suscribirse:', error);
        showLoading(false);
        alert('Error al activar las notificaciones. Por favor, verifica los permisos del navegador.');
    }
}

// Enviar notificación (simula envío a todos los usuarios)
// NOTA: En producción, esto debería hacerse desde tu servidor usando la API de OneSignal
async function sendNotification() {
    if (!isOneSignalInitialized) {
        alert('OneSignal no está inicializado');
        return;
    }

    const frase = frasesFilosoficas[Math.floor(Math.random() * frasesFilosoficas.length)];
    
    showLoading(true);
    showQuote(frase.texto, frase.autor);

    // Mostrar notificación local
    if ('Notification' in window && Notification.permission === 'granted') {
        const iconPath = BASE_PATH === '/' ? 'icon-192.png' : BASE_PATH + 'icon-192.png';
        new Notification('🧠 Frase Filosófica', {
            body: `${frase.texto} — ${frase.autor}`,
            icon: iconPath,
            badge: iconPath,
            tag: 'frase-filosofica'
        });
    }

    // NOTA: Para enviar a todos los usuarios, necesitas usar la API REST de OneSignal desde tu servidor
    // Esta función solo muestra una notificación local como demo
    console.log('Para enviar a todos los usuarios, usa la API REST de OneSignal desde tu servidor');
    
    showLoading(false);
}

// Mostrar cita
function showQuote(texto, autor) {
    const quoteCard = document.getElementById('quoteCard');
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');

    quoteText.textContent = texto;
    quoteAuthor.textContent = autor;
    quoteCard.style.display = 'block';

    // Ocultar después de 10 segundos
    setTimeout(() => {
        quoteCard.style.display = 'none';
    }, 10000);
}

// Mostrar/ocultar loading
function showLoading(show) {
    const loading = document.getElementById('loading');
    loading.style.display = show ? 'flex' : 'none';
}

// Event Listeners

// Evento beforeinstallprompt (PWA install)
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    if (!checkIfInstalled()) {
        document.getElementById('installSection').style.display = 'block';
    }
});

// Botón de instalación
document.getElementById('installBtn').addEventListener('click', async () => {
    if (!deferredPrompt) {
        alert('La aplicación ya está instalada o no está disponible para instalación');
        return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        console.log('Usuario aceptó la instalación');
        document.getElementById('installSection').style.display = 'none';
        document.getElementById('installedStatus').style.display = 'block';
    }
    
    deferredPrompt = null;
});

// Botón de suscripción
document.getElementById('subscribeBtn').addEventListener('click', subscribeToNotifications);

// Botón de enviar notificación
document.getElementById('sendNotificationBtn').addEventListener('click', sendNotification);

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Inicializando aplicación...');
    
    // Verificar si está instalada
    checkIfInstalled();
    
    // Registrar Service Worker
    await registerServiceWorker();
    
    // Esperar a que OneSignal esté disponible
    if (typeof OneSignal !== 'undefined') {
        initializeOneSignal();
    } else {
        // Esperar a que el script de OneSignal se cargue
        window.addEventListener('load', () => {
            setTimeout(initializeOneSignal, 1000);
        });
    }

    // Verificar permisos de notificación
    if ('Notification' in window && Notification.permission === 'default') {
        console.log('Permisos de notificación aún no solicitados');
    }
});

// Evento cuando la app se instala
window.addEventListener('appinstalled', () => {
    console.log('Aplicación instalada');
    document.getElementById('installSection').style.display = 'none';
    document.getElementById('installedStatus').style.display = 'block';
});
