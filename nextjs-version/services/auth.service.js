const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

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

async function deleteUser() {
    const response = await fetch(`${API_BASE_URL}/users/delete`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    const result = await response.json();
    return result;
}

export {
    registerUser,
    loginUser,
    deleteUser
}