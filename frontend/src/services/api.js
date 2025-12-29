const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

async function handleResponse(response) {
  // Handle 204 No Content responses (like DELETE operations)
  if (response.status === 204) {
    if (!response.ok) {
      throw new ApiError('Request failed', response.status, null);
    }
    return null;
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    // Handle FastAPI validation errors
    let errorMessage = 'An error occurred';

    if (data.detail) {
      if (Array.isArray(data.detail)) {
        // FastAPI validation errors format
        errorMessage = data.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ');
      } else if (typeof data.detail === 'string') {
        errorMessage = data.detail;
      }
    } else if (data.message) {
      errorMessage = data.message;
    }

    throw new ApiError(errorMessage, response.status, data);
  }

  return data;
}

export const api = {
  // Client Contacts API
  clientContacts: {
    create: async (contactData) => {
      const response = await fetch(`${API_BASE_URL}/client_contacts/create_client_contact_info/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(contactData),
      });
      return handleResponse(response);
    },

    getAll: async (skip = 0, limit = 100) => {
      const response = await fetch(
        `${API_BASE_URL}/client_contacts/get_all_client_contact_info?skip=${skip}&limit=${limit}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      return handleResponse(response);
    },

    getOne: async (id) => {
      const response = await fetch(
        `${API_BASE_URL}/client_contacts/get_one_client_contact_info/${id}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      return handleResponse(response);
    },

    update: async (id, updateData) => {
      const response = await fetch(
        `${API_BASE_URL}/client_contacts/update_client_contact_info/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updateData),
        }
      );
      return handleResponse(response);
    },

    delete: async (id) => {
      const response = await fetch(
        `${API_BASE_URL}/client_contacts/delete_client_contact_info/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
      return handleResponse(response);
    },

    searchByName: async (name) => {
      const response = await fetch(
        `${API_BASE_URL}/client_contacts/search_client_contact_by_name/?name=${encodeURIComponent(name)}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      return handleResponse(response);
    },
  },

  // Appointments API
  appointments: {
    create: async (appointmentData) => {
      const response = await fetch(`${API_BASE_URL}/appointments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(appointmentData),
      });
      return handleResponse(response);
    },

    getAll: async (skip = 0, limit = 100) => {
      const response = await fetch(
        `${API_BASE_URL}/appointments/all?skip=${skip}&limit=${limit}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      return handleResponse(response);
    },

    getById: async (id) => {
      const response = await fetch(
        `${API_BASE_URL}/appointments/get/${id}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      return handleResponse(response);
    },

    update: async (id, updateData) => {
      const response = await fetch(
        `${API_BASE_URL}/appointments/update/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updateData),
        }
      );
      return handleResponse(response);
    },

    delete: async (id) => {
      const response = await fetch(
        `${API_BASE_URL}/appointments/delete/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
      return handleResponse(response);
    },

    getByDate: async (date) => {
      const response = await fetch(
        `${API_BASE_URL}/appointments/by-date/${date}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      return handleResponse(response);
    },

    getByStatus: async (status) => {
      const response = await fetch(
        `${API_BASE_URL}/appointments/by-status/${status}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      return handleResponse(response);
    },

    searchByName: async (name) => {
      const response = await fetch(
        `${API_BASE_URL}/appointments/search?name=${encodeURIComponent(name)}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      return handleResponse(response);
    },
  },

  // Auth API
  auth: {
    login: async (username, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: username,
          password: password
        }),
      });
      return handleResponse(response);
    },

    getCurrentUser: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });
      return handleResponse(response);
    },

    logout: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      return handleResponse(response);
    },

    register: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
  },
};

export { ApiError };
