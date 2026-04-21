import axios from "axios";


const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error.response || error.message);

    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login"; // auto logout
    }

    return Promise.reject(error);
  }
);



export const getProperties = async () => {
  const res = await api.get("/property");
  return res.data;
};

export const getPropertyById = async (id) => {
  const res = await api.get(`/property/${id}`);
  return res.data;
};

export const addProperty = async (data) => {
  const res = await api.post("/property", data);
  return res.data;
};

export const deleteProperty = async (id) => {
  const res = await api.delete(`/property/${id}`);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};


export const bookProperty = async (data) => {
  const res = await api.post("/bookings", data);
  return res.data;
};

export const getUserBookings = async (userId) => {
  const res = await api.get(`/bookings/user/${userId}`);
  return res.data;
};

export const cancelBooking = async (id) => {
  const res = await api.delete(`/bookings/${id}`);
  return res.data;
};

export const checkBooking = async (userId, propertyId) => {
  const res = await api.get(
    `/bookings/check?userId=${userId}&propertyId=${propertyId}`
  );
  return res.data;
};

export const approveBooking = async (id) => {
  const res = await api.put(`/bookings/${id}/approve`);
  return res.data;
};

export const rejectBooking = async (id) => {
  const res = await api.put(`/bookings/${id}/reject`);
  return res.data;
};


export const getAdminBookings = async () => {
  const res = await api.get("/bookings/admin");
  return res.data;
};

export const getRentals = async () => {
  const res = await api.get("/bookings/rentals");
  return res.data;
};


export const startChat = async (data) => {
  const res = await api.post("/chat/start", data);
  return res.data;
};

export const getMessages = async (conversationId) => {
  const res = await api.get(`/chat/${conversationId}`);
  return res.data;
};


export const addFavorite = async (propertyId) => {
  const userId = localStorage.getItem("userId");

  const res = await api.post("/favorite", {
    userId,
    propertyId,
  });

  return res.data;
};

export const getFavorites = async (userId) => {
  const res = await api.get(`/favorite/user/${userId}`);
  return res.data;
};

export const removeFavorite = async (propertyId) => {
  const userId = localStorage.getItem("userId");

  const res = await api.delete(
    `/favorite/${propertyId}?userId=${userId}`
  );

  return res.data;
};

export const checkFavorite = async (userId, propertyId) => {
  const res = await api.get(
    `/favorite/check?userId=${userId}&propertyId=${propertyId}`
  );

  return res.data;
};


export const getPaymentHistory = async (agreementId) => {
  const res = await api.get(`/rentpayment/history/${agreementId}`);
  return res.data;
};

export const endRental = async (id) => {
  const res = await api.post(`/rental/end/${id}`);
  return res.data;
};


export default api;