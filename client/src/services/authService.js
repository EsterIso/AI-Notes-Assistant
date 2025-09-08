
console.log('All env variables:', import.meta.env);
console.log('VITE_API_URL specifically:', import.meta.env.VITE_API_URL);
console.log('Constructed URL:', `${import.meta.env.VITE_API_URL}/users/login`);


const API_BASE_URL = import.meta.env.VITE_API_URL;

async function registerUser(data) {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
}

async function loginUser(data) {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
}

export {
    registerUser,
    loginUser
}