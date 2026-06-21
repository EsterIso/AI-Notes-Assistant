const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function deleteUser() {
    const response = await fetch(`${API_BASE_URL}/users/delete`, {
        method: 'DELETE',
    });
    const result = await response.json();
    return result;
}

export {
    deleteUser
}
