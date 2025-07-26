const API_URL = 'http://localhost:3001/api/boulders';

export const uploadBoulder = async (formData) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error uploading boulder: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error; // Re-throw the error to be caught by the caller
    }
};


export const deleteBoulder = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error deleting boulder: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        throw error; // Re-throw the error to be caught by the caller
    }
}

export const getAllBoulders = async () => {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error fetching boulders: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        throw error; // Re-throw the error to be caught by the caller
    }
}