const SERVER_URL = "http://localhost:8081";

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/users`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${SERVER_URL}/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

export const addUser = async (user) => {
  const url = `${SERVER_URL}/users`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error("Add user error:", error);
  }
};

export const editUser = async (id, user) => {
  const url = `${SERVER_URL}/users/${id}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error("Edit user error:", error);
  }
};

export const getUser = async (id) => {
  const url = `${SERVER_URL}/users/${id}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error("Get user error:", error);
  }
};

export const getLastUserId = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/lastUserId`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

export const editImage = async (imageId, imageData) => {
  const url = `${SERVER_URL}/images/${imageId}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      body: imageData,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error("Edit image error:", error);
  }
};


export const getLastImageId = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/lastImageId`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.lastImageId;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

export const getUserImages = async (userName) => {
  try {
    const response = await fetch(`${SERVER_URL}/user-images?userName=${userName}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch user images error:", error);
  }
};




export const getAllImages = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/images`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch images error:", error);
  }
};



export const uploadImage = async (imageData) => {
  const url = `${SERVER_URL}/upload`;
  try {
    const response = await fetch(url, {
      method: "POST",
      body: imageData,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error("Upload image error:", error);
  }
};


export const deleteImage = async (imageId) => {
  try {
    const response = await fetch(`${SERVER_URL}/images/${imageId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

export const searchUsers = async (query) => {
  try {
    const response = await fetch(`http://localhost:8081/search-users?q=${query}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Search error:", error);
  }
};




