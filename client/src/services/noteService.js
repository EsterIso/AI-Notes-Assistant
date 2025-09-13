const API_BASE_URL = import.meta.env.VITE_API_URL;

// Get auth headers with token
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Get all notes for the authenticated user
async function getNotes() {
    const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    return await response.json();
}

// Get a single note by ID
async function getNoteById(id) {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    return await response.json();
}

// Create a new note
async function createNote(noteData) {
    const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(noteData)
    });
    return await response.json();
}

// Update an existing note
async function updateNote(id, noteData) {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(noteData)
    });
    return await response.json();
}

// Delete a note
async function deleteNote(id) {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return await response.json();
}

// Create note from PDF file (sent as base64)
async function createNoteFromFile(file, title) {
    try {
        // Only allow PDF
        if (file.type !== 'application/pdf') {
            throw new Error('Please upload a PDF file only');
        }

        // Validate file size (50MB limit)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('File size must be less than 50MB');
        }

        // Convert PDF to Base64
        const base64PDF = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
        });

        // Create note with base64 PDF
        const noteData = {
            title: title || file.name.replace(/\.[^/.]+$/, ""), // Remove extension if no title provided
            inputType: 'pdf',
            originalContent: {
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                base64: base64PDF
            }
        };

        return await createNote(noteData);
    } catch (error) {
        throw error;
    }
}

// Create text note
async function createTextNote(title, textContent) {
    const noteData = {
        title,
        inputType: 'text',
        originalContent: {
            text: textContent
        }
    };
    return await createNote(noteData);
}

export {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
    createNoteFromFile,
    createTextNote
};
