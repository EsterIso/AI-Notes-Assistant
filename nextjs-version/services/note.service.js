const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Supported file types and their configurations
const SUPPORTED_FILE_TYPES = {
    // Document formats
    'application/pdf': { extension: 'pdf', needsConversion: true, maxSize: 50 },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { extension: 'docx', needsConversion: true, maxSize: 50 },
    
    // Text formats
    'text/plain': { extension: 'txt', needsConversion: false, maxSize: 10 },
    'text/markdown': { extension: 'md', needsConversion: false, maxSize: 10 }
};

// Get auth headers with token
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Validate file type and size
const validateFile = (file) => {
    const fileConfig = SUPPORTED_FILE_TYPES[file.type];
    
    if (!fileConfig) {
        // Check by file extension as fallback
        const extension = file.name.split('.').pop().toLowerCase();
        const configByExtension = Object.values(SUPPORTED_FILE_TYPES).find(config => config.extension === extension);
        
        if (!configByExtension) {
            throw new Error(`File type not supported. Supported formats: PDF, DOCX, TXT, MD`);
        }
        return configByExtension;
    }
    
    const maxSize = fileConfig.maxSize * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
        throw new Error(`File size must be less than ${fileConfig.maxSize}MB for ${fileConfig.extension.toUpperCase()} files`);
    }
    
    return fileConfig;
};

// Read file as text
const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsText(file, 'UTF-8');
    });
};

// Read file as base64
const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
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

// Create note from any supported file type
async function createNoteFromFile(file, title) {
    try {
        // Validate file
        const fileConfig = validateFile(file);
        
        let originalContent;
        let inputType;
        
        if (fileConfig.needsConversion) {
            // Files that need base64 conversion (PDF, DOCX, DOC, ODT, RTF)
            const base64Content = await readFileAsBase64(file);
            
            inputType = fileConfig.extension;
            originalContent = {
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                base64: base64Content
            };
        } else {
            // Plain text files that can be read directly
            const textContent = await readFileAsText(file);
            
            inputType = 'text';
            originalContent = {
                text: textContent,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                originalFormat: fileConfig.extension
            };
        }

        // Create note
        const noteData = {
            title: title || file.name.replace(/\.[^/.]+$/, ""), // Remove extension if no title provided
            inputType,
            originalContent
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

// Get supported file types for file input
function getSupportedFileTypes() {
    return Object.keys(SUPPORTED_FILE_TYPES).join(',');
}

// Get file type info for UI display
function getFileTypeInfo() {
    const groups = {
        documents: ['pdf', 'docx'],
        text: ['txt', 'md']
    };
    
    return groups;
}

export {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
    createNoteFromFile,
    createTextNote,
    getSupportedFileTypes,
    getFileTypeInfo,
    SUPPORTED_FILE_TYPES
};