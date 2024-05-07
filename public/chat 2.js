// public/chat.js
const socket = io('/');

let userName = '';

const getUserName = () => {
    userName = localStorage.getItem('username');
    if (userName) {
        document.getElementById('user').innerText = userName;
        localStorage.setItem('username', userName);
    } else {
        console.log("What's your name then?", userName);
        window.location.href = '';
    }
}

const initSocketEventListeners = () => {
    socket.emit('newUser', {
        user: userName,
        chat: window.location.href.split('/').pop() // Chat id
    });
    
    socket.on('newUser', (data) => {
        sendNewUserMessage(data.user);
    });
    
    socket.on('newMessage', (data) => {
        sendNewMessage(data);
    });
    
    socket.on('userLeft', (data) => {
        sendUserLeftMessage(data.user);
    });
}

const sendNewUserMessage = (name) => {
    const p = document.createElement('p');
    p.className = 'new-user';
    p.innerText = `${name} joined the chat`;
    document.getElementById('messages').append(p);
}

const sendUserLeftMessage = (name) => {
    const p = document.createElement('p');
    p.className = 'user-left';
    p.innerText = `${name} left the chat`;
    document.getElementById('messages').append(p);
}

const sendNewMessage = (data, mine) => {
    const p = document.createElement('p');
    let name = data.user;
    if (mine) {
        p.className = 'message mine';
        name = 'You';
    } else {
        p.className = 'message';
    }

    p.innerHTML = `<span>${name}</span><p>${data.message}</p>`;
    p.id = new Date().getTime();
    document.getElementById('messages').append(p);  
    document.getElementById(p.id).scrollIntoView();
}

// Se crean dos manejadores separados para cada botón
const initMessageForm = () => {
    const form = document.querySelector('form');
    
    // Manejador para el botón de "Enviar Apuesta"
    form.querySelector('.bet-button').addEventListener('click', (event) => {
        event.preventDefault();
        const input = form.querySelector('input[type="text"]');
        const teamSelect = form.querySelector('select[name="team"]');
        const betSelect = form.querySelector('select[name="bet"]');
    
        const message = input.value || ""; // Permitir apuestas sin mensaje
        const team = teamSelect.value;
        const bet = betSelect.value;
    
        const completeMessage = `${message} -.bet ${team} $${bet} dls.-`;
    
        // Enviar el mensaje a través de socket.io
        sendNewMessage({ message: completeMessage, user: userName }, true);
    
        socket.emit('newMessage', {
            user: userName,
            message: completeMessage
        });
    
        // Enviar el mensaje al servidor para guardar en archivo
        axios.post('/bets/save-bet', { message: completeMessage })
            .then(() => console.log('Apuesta guardada con éxito'))
            .catch(err => console.error('Error al guardar la apuesta', err));
    
        input.value = ''; // Limpia el campo de texto
    });
    

    // Manejador para el botón de "Chat"
    form.querySelector('.chat-button').addEventListener('click', (event) => {
        event.preventDefault();
        const input = form.querySelector('input[type="text"]');
        
        const message = input.value; // Se requiere un mensaje para el chat
        if (!message) return; // Si no hay mensaje, no hace nada

        sendNewMessage({ message, user: userName }, true);

        socket.emit('newMessage', {
            user: userName,
            message
        });

        input.value = ''; // Limpia el campo de entrada después de enviar el mensaje
    });
}

// Inicialización
(() => {
    getUserName();
    initSocketEventListeners();
    initMessageForm();
    sendNewUserMessage('You'); 

    window.onbeforeunload = () => {
        return 'Are you sure you want to leave?';
    };
})();
