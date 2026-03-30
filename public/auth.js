// auth.js - Модуль управления доступом
export function initAuth(renderCallback) {
    const { auth, authFunc } = window;
    const { signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } = authFunc;

    window.isAuthenticated = false;
    window.userRole = 'guest';
    window.isAuthReady = false;

    setPersistence(auth, browserLocalPersistence).then(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                window.isAuthenticated = true;
                window.userRole = 'admin';
                if (window.currentPage === 'login') window.currentPage = 'home';
            } else {
                window.isAuthenticated = false;
                window.userRole = 'agent';
                if (['home', 'bookings', 'partners', 'profile'].includes(window.currentPage)) {
                    window.currentPage = 'login';
                }
            }

            if (!window.isAuthReady) {
                window.isAuthReady = true;
                const loader = document.getElementById('auth-loader');
                if (loader) loader.classList.add('hidden');
            }
            renderCallback(window.currentPage);
        });
    });

    window.login = async function() {
        const email = document.getElementById('email-field').value;
        const pass = document.getElementById('pass-field').value;
        if (!email || !pass) return alert("Please enter credentials!");
        try { await signInWithEmailAndPassword(auth, email, pass); } 
        catch (error) { alert("Access Denied: " + error.message); }
    };

    window.logout = async () => { 
        await signOut(auth); 
        window.currentPage = 'login'; 
    };
}