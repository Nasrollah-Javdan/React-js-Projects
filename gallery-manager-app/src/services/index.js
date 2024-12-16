const SERVER_URL = "http://localhost:8081";

const getToken = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; token=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const fetchWithToken = async (url, options = {}) => {
  const token = getToken();

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    // حذف 'Content-Type': 'application/json' زیرا فرم‌داده خود تنظیم می‌شود
  };
  options.credentials = "include"; // اضافه کردن credentials به include

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const getAllUsers = async () => {
  try {
    const data = await fetchWithToken(`${SERVER_URL}/users`);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

export const uploadImage = async (imageData) => {
  const url = "http://localhost:8081/upload";
  
  try {
    const response = await fetchWithToken(url, {
      method: "POST",
      body: imageData,
    });
    return response;
  } catch (error) {
    console.error("Add image error:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const data = await fetchWithToken(`${SERVER_URL}/users/${id}`, {
      method: "DELETE",
    });
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};


export const addUser = async (data) => {
  const url = `${SERVER_URL}/users`;
  try {
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }

    const token = getToken(); // Ensure getToken is defined and working
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
      credentials: 'include',
    });

    console.log("Response status:", response.status);

    // Check if response is a JSON object
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const responseData = await response.json();
      console.log("Server response (JSON):", responseData);
      return responseData;
    } else {
      const responseText = await response.text();
      console.log("Server response (text):", responseText);
      throw new Error("Unexpected response type");
    }
  } catch (error) {
    console.error("Add user error:", error);
    throw error;
  }
};



export const editUser = async (id, user) => {
  const url = `${SERVER_URL}/users/${id}`;
  try {
    const data = new FormData();
    Object.keys(user).forEach(key => {
      data.append(key, user[key]);
    });

    const token = getToken(); // Ensure getToken is defined and working
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
      credentials: 'include',
    });

    console.log("Response status:", response.status);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const responseData = await response.json();
      console.log("Server response (JSON):", responseData);
      return responseData;
    } else {
      const responseText = await response.text();
      console.log("Server response (text):", responseText);
      throw new Error("Unexpected response type");
    }
  } catch (error) {
    console.error("Edit user error:", error);
    throw error;
  }
};



export const getUser = async (id) => {
  const url = `${SERVER_URL}/users/${id}`;
  try {
    const data = await fetchWithToken(url);
    return data;
  } catch (error) {
    console.error("Get user error:", error);
  }
};

export const getLastUserId = async () => {
  try {
    const data = await fetchWithToken(`${SERVER_URL}/lastUserId`);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

export const editImage = async (imageId, imageData) => {
  const url = `${SERVER_URL}/images/${imageId}`;
  try {
    const response = await fetchWithToken(url, {
      method: "PUT",
      body: imageData,
    });
  } catch (error) {
    console.error("Edit image error:", error);
    throw error;
  }
};

export const getLastImageId = async () => {
  try {
    const data = await fetchWithToken(`${SERVER_URL}/lastImageId`);
    return data.lastImageId;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

export const getUserImages = async (userName) => {
  try {
    const data = await fetchWithToken(
      `${SERVER_URL}/user-images?userName=${userName}`
    );
    return data;
  } catch (error) {
    console.error("Fetch user images error:", error);
  }
};

export const getAllImages = async () => {
  try {
    const data = await fetchWithToken(`${SERVER_URL}/images`);
    return data;
  } catch (error) {
    console.error("Fetch images error:", error);
  }
};

export const deleteImage = async (imageId) => {
  try {
    const data = await fetchWithToken(`${SERVER_URL}/images/${imageId}`, {
      method: "DELETE",
    });
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

export const searchUsers = async (query) => {
  try {
    const data = await fetchWithToken(
      `http://localhost:8081/search-users?q=${query}`
    );
    return data;
  } catch (error) {
    console.error("Search error:", error);
  }
};

export const searchImages = async (query) => {
  try {
    const data = await fetchWithToken(
      `http://localhost:8081/search-images?q=${query}`
    );
    return data;
  } catch (error) {
    console.error("Search error:", error);
  }
};
