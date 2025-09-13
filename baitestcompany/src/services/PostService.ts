const API_URL = "http://localhost:8080/api/posts"; // backend URL

// Create Post
export const createPost = async (post: {
    title: string;
    content: string;
    username: string;
}) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,

            "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
    });

    if (!res.ok) {
        const err = await res.json();
        throw err;
    }
    return res.json();
};

// Get Post by ID
export const getPostById = async (id: number) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "GET",
    });

    if (!res.ok) {
        const err = await res.json();
        throw err;
    }
    return res.json();
};

// Get all Posts
export const getAllPosts = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw err;
    }
    return res.json();
};

// Get my post
export const getMyPosts = async (username: string) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/my_post?username=${encodeURIComponent(username)}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw err;
    }
    return res.json();
};

// Update Post
export const updatePost = async (

    id: number,
    post: { title: string; content: string; username: string }
) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
    });

    if (!res.ok) {
        const err = await res.json();
        throw err;
    }
    return res.json();
};

// Delete Post
export const deletePost = async (id: number) => {
    const token = localStorage.getItem("token");  

    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,  
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw err;
    }
    return res.json();
};

export const searchPosts = async (keyword: string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(keyword)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  return res.json();
};


