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
    console.log('Path completo:', path);
    
    // Si la ruta es exactamente '/', está en la raíz
    if (path === '/') {
        return '/';
    }
    
    // Extraer el nombre del repositorio de la ruta
    // Ejemplo: /noti/ -> /noti/
    // Ejemplo: /noti/index.html -> /noti/
    // Ejemplo: /noti -> /noti/
    const parts = path.split('/').filter(p => p && p !== 'index.html');
    
    if (parts.length > 0) {
        // Si el primer elemento no es vacío, es una subcarpeta (repositorio)
        const basePath = '/' + parts[0] + '/';
        console.log('Ruta base detectada (subcarpeta):', basePath);
        return basePath;
    }
    
    console.log('Ruta base detectada (raíz): /');
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

// Inicializar OneSignal (usando OneSignalDeferred)
function initializeOneSignal() {
    // OneSignal ya está siendo inicializado por el script en index.html usando OneSignalDeferred
    // Esperamos a que esté listo
    if (typeof OneSignal !== 'undefined' && window.OneSignal) {
        oneSignalInstance = window.OneSignal;
        
        // Event listener para cambios de suscripción
        oneSignalInstance.on('subscriptionChange', function(isSubscribed) {
            console.log('Estado de suscripción cambió:', isSubscribed);
            updateSubscriptionUI(isSubscribed);
        });

        isOneSignalInitialized = true;
        console.log('OneSignal inicializado correctamente');
        
        // Esperar un momento y luego verificar el estado
        setTimeout(() => {
            checkSubscriptionStatus();
        }, 1000);
    } else if (window.OneSignalDeferred) {
        // Si OneSignal aún no está disponible pero OneSignalDeferred existe,
        // agregar un callback adicional para cuando esté listo
        window.OneSignalDeferred.push(async function(OneSignal) {
            oneSignalInstance = OneSignal;
            
            // Event listener para cambios de suscripción
            oneSignalInstance.on('subscriptionChange', function(isSubscribed) {
                console.log('Estado de suscripción cambió:', isSubscribed);
                updateSubscriptionUI(isSubscribed);
            });

            isOneSignalInitialized = true;
            console.log('OneSignal inicializado desde deferred');
            
            // Esperar un momento y luego verificar el estado
            setTimeout(() => {
                checkSubscriptionStatus();
            }, 1000);
        });
    } else {
        console.log('Esperando a que OneSignal se cargue...');
        setTimeout(initializeOneSignal, 500);
    }
}

// Verificar estado de suscripción
async function checkSubscriptionStatus() {
    if (!isOneSignalInitialized || !oneSignalInstance) {
        console.log('OneSignal no está inicializado aún');
        return;
    }

    try {
        // Verificar estado de suscripción usando la API de OneSignal v16
        const isSubscribed = await oneSignalInstance.User.PushSubscription.id !== null;
        console.log('Estado de suscripción:', isSubscribed);
        updateSubscriptionUI(isSubscribed);
    } catch (error) {
        console.error('Error al verificar suscripción:', error);
        // Intentar método alternativo usando permisos nativos
        try {
            const permission = await oneSignalInstance.Notifications.permissionNative;
            const isSubscribed = permission === 'granted';
            console.log('Estado de suscripción (alternativo):', isSubscribed);
            updateSubscriptionUI(isSubscribed);
        } catch (err) {
            console.error('Error alternativo:', err);
            // Si todo falla, asumir que no está suscrito
            updateSubscriptionUI(false);
        }
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
    if (!isOneSignalInitialized || !oneSignalInstance) {
        alert('OneSignal aún no está inicializado. Por favor, espera un momento.');
        return;
    }

    try {
        showLoading(true);
        
        // Solicitar permisos usando el método correcto de OneSignal v16
        await oneSignalInstance.Notifications.requestPermission();
        
        // Esperar un momento para que se procese la suscripción
        setTimeout(async () => {
            try {
                // Verificar el estado después de solicitar permisos
                const permission = await oneSignalInstance.Notifications.permissionNative;
                const hasSubscriptionId = await oneSignalInstance.User.PushSubscription.id !== null;
                
                if (permission === 'granted' || hasSubscriptionId) {
                    checkSubscriptionStatus();
                    showLoading(false);
                    showQuote('🎉 ¡Suscripción exitosa!', 'Ahora recibirás frases filosóficas');
                } else {
                    showLoading(false);
                    alert('Se necesita permiso para enviar notificaciones. Por favor, acepta los permisos cuando se soliciten.');
                }
            } catch (err) {
                console.error('Error al verificar después de solicitar:', err);
                checkSubscriptionStatus();
                showLoading(false);
            }
        }, 1500);
        
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
    console.log('Ruta base detectada:', BASE_PATH);
    
    // Verificar si está instalada
    checkIfInstalled();
    
    // Registrar Service Worker
    await registerServiceWorker();
    
    // Inicializar OneSignal (el script ya está en el HTML con OneSignalDeferred)
    // Esperar a que la página cargue completamente
    window.addEventListener('load', () => {
        setTimeout(() => {
            initializeOneSignal();
        }, 1500); // Dar tiempo a que OneSignal se inicialice completamente
    });

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
