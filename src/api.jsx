import axios from "axios";

// --- CONFIGURATION ---
// Pointing to Localhost for your Python LLM Backend
const API_BASE_URL = "http://127.0.0.1:8000";
// const API_BASE_URL = "https://qi-backend-staging-bkatd9dxecfvbmh4.westeurope-01.azurewebsites.net";

console.log("API_BASE_URL", API_BASE_URL);

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    authorization: "",
  },
  withCredentials: false, 
});

// --- HELPER FUNCTIONS ---

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const [, payloadBase64] = token.split(".");
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return Date.now() >= decodedPayload.exp * 1000;
  } catch (error) {
    console.error("Invalid token:", error);
    return true;
  }
};

const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) throw new Error("No refresh token available");

    const response = await axios.post(`${API_BASE_URL}/accounts/login/refresh/`, {
      refresh,
    });

    const accessToken = response.data["access"];
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
};

const handleError = (error) => {
  if (error.response) {
    return error.response.data || "An error occurred on the server.";
  }
  return error.message || "An unexpected error occurred.";
};

// --- INTERCEPTORS ---

apiClient.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("accessToken");
    const refreshTokenValue = localStorage.getItem("refreshToken");

    if (refreshTokenValue && isTokenExpired(accessToken)) {
      console.warn("Access token expired! Refreshing...");
      accessToken = await refreshToken();
    }

    if (accessToken) {
      config.headers.authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest); 
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Prevent redirect loop during dev
        console.warn("API 401: Auth failed. Redirect disabled for dev mode.");
        // window.location.href = "/login"; 
      }
    }
    return Promise.reject(error);
  }
);

// --- AUTH API CALLS ---

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/accounts/login/`, {
      username,
      password,
    });
    const data = response.data;
    if (data["access"]) localStorage.setItem("accessToken", data["access"]);
    if (data["refresh"]) localStorage.setItem("refreshToken", data["refresh"]);
    localStorage.setItem("username", username);
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

// This was missing and caused your error
export const register = async (username, password, password2, email, first_name, last_name) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/accounts/register/`, {
      username,
      password,
      password2,
      email,
      first_name,
      last_name,
    });
    return response.data; 
  } catch (error) {
    throw handleError(error); 
  }
};

export const resetPasswordConfirm = async (token, new_password, new_password2) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/accounts/password-reset-confirm/`, {
      token,
      new_password,
      new_password2
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/accounts/password-reset/`, { email });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteAccount = async (password, reason) => {
  try {
    const response = await apiClient.post('/accounts/delete/', {
      password,
      ...(reason && { reason })
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// --- BROKER API CALLS ---

export const getBrokers = async () => {
  try {
    const response = await apiClient.get("/brokers/");
    return response.data; 
  } catch (error) {
    console.error("Error fetching brokers:", error);
    throw handleError(error);
  }
};

export const addBroker = async (broker) => {
  try {
    const response = await apiClient.post("/brokers/", broker);
    return response.data;
  } catch (error) {
    console.error('Error adding broker:', error);
    throw error;
  }
};

export const removeBroker = async (brokerIdOrName) => {
  try {
    let brokerName = brokerIdOrName;
    if (typeof brokerIdOrName === 'number') {
      const brokers = await getBrokers();
      const broker = brokers.find((b) => b.id === brokerIdOrName);
      if (broker) brokerName = broker.name;
    }
    const endpoint = `/brokers/${brokerName}/`;
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createBroker = async ({ name, api_key, api_secret, test_mode }) => {
  try {
    const response = await apiClient.post('/brokers/', {
      name,
      api_key,
      api_secret,
      test_mode
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBrokerByName = async (name) => {
  try {
    const response = await apiClient.get(`/brokers/${name}/`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getAvailableBrokers = async () => {
  try {
    const response = await apiClient.get("/brokers/available/");
    return response.data; 
  } catch (error) {
    throw handleError(error);
  }
};

export const getAvailableAssets = async () => {
  try {
    const response = await apiClient.get("/assets/available/");
    return response.data; 
  } catch (error) {
    throw handleError(error);
  }
};

// --- USER PROFILE CALLS ---

export const getUserDetails = async () => {
  try {
    const response = await apiClient.get('/accounts/get-details/');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getProfile = async () => {
  try {
    const response = await apiClient.get('/accounts/profile/');
    return response.data; 
  } catch (error) {
    throw handleError(error);
  }
};

export const updateProfile = async ({ location, birth_date }) => {
  try {
    const response = await apiClient.put('/accounts/profile/', { location, birth_date });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const patchProfile = async (partial) => {
  try {
    const response = await apiClient.patch('/accounts/profile/', partial);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// --- BOT API CALLS ---

export const deployDCABot = async (botData, botType = "Basic") => {
  try {
    let endpoint = '/bots/dca/basic';
    const botTypeLower = String(botType).toLowerCase();

    if (botTypeLower === 'advanced' || botTypeLower === 'advance' || botTypeLower === 'smart') {
      endpoint = '/bots/dca/advanced';
    }
    const response = await apiClient.post(endpoint, botData);
    return response.data;
  } catch (error) {
    // Retry with trailing slash if 404
    if (error?.response?.status === 404) {
        try {
            let endpoint = '/bots/dca/basic/';
            const botTypeLower = String(botType).toLowerCase();
            if (botTypeLower === 'advanced' || botTypeLower === 'advance' || botTypeLower === 'smart') {
                endpoint = '/bots/dca/advanced/';
            }
            const response = await apiClient.post(endpoint, botData);
            return response.data;
        } catch(retryError) {
            throw retryError;
        }
    }
    throw error;
  }
};

export const getDCABots = async () => {
  try {
    const response = await apiClient.get('/bots/dca-bots/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const listBasicDcaBots = async () => {
  try {
    const [basicBots, advancedBots, smartBots] = await Promise.all([
      apiClient.get('/bots/dca/basic').then(res => res.data).catch(() => []),
      apiClient.get('/bots/dca/advanced').then(res => res.data).catch(() => []),
      apiClient.get('/bots/dca/smart').then(res => res.data).catch(() => [])
    ]);

    const markedBasicBots = Array.isArray(basicBots) ? basicBots.map(bot => ({ ...bot, bot_type: 'basic', _source: 'basic' })) : [];
    const markedAdvancedBots = Array.isArray(advancedBots) ? advancedBots.map(bot => ({ ...bot, bot_type: 'advanced', _source: 'advanced' })) : [];
    const markedSmartBots = Array.isArray(smartBots) ? smartBots.map(bot => ({ ...bot, bot_type: 'smart', _source: 'smart' })) : [];

    return [...markedBasicBots, ...markedAdvancedBots, ...markedSmartBots];
  } catch (error) {
    console.error("Error fetching bots:", error);
    return [];
  }
};

export const createBasicDcaBot = async (bot) => {
  try {
    const response = await apiClient.post('/bots/dca-bots/', bot);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const readBasicDcaBot = async (identifier) => {
  try {
    const response = await apiClient.get(`/bots/dca-bots/${identifier}/`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deployDCASmartBot = async (bot) => {
  try {
    const response = await apiClient.post('/bots/dca/smart', bot);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getSmartBots = async () => {
  try {
    const response = await apiClient.get('/bots/dca/smart');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateBasicDcaBot = async (identifier, bot) => {
  try {
    const response = await apiClient.put(`/bots/dca-bots/${identifier}/`, bot);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const patchBasicDcaBot = async (identifier, partial) => {
  try {
    const response = await apiClient.patch(`/bots/dca-bots/${identifier}/`, partial);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteBasicDcaBot = async (identifier, botType = 'basic') => {
  try {
    const botTypeLower = String(botType).toLowerCase();
    let endpoint;
    if (botTypeLower === 'smart') {
      endpoint = `/bots/dca/smart/${identifier}/`;
    } else if (botTypeLower === 'advanced' || botTypeLower === 'advance') {
      endpoint = `/bots/dca/advanced/${identifier}/`;
    } else {
      endpoint = `/bots/dca/basic/${identifier}/`;
    }

    try {
      const response = await apiClient.delete(endpoint);
      return response.data;
    } catch (firstError) {
      if (endpoint.endsWith('/')) {
        const endpointWithoutSlash = endpoint.slice(0, -1);
        try {
          const response = await apiClient.delete(endpointWithoutSlash);
          return response.data;
        } catch (secondError) {
          throw secondError;
        }
      } else {
        throw firstError;
      }
    }
  } catch (error) {
    throw handleError(error);
  }
};

export default apiClient;