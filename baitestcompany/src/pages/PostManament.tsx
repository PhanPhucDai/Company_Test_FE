import React, { useState, useEffect } from "react";
import { Container, Grid, List, ListItem, ListItemButton, ListItemText, Box, Typography, CircularProgress, TextField, Button } from "@mui/material";
import { createPost, getAllPosts, getMyPosts, searchPosts, updatePost } from "../services/PostService";
import AllPost from "./AllPost";
import MyPost from "./MyPost";
import DialogFormPost from "../components/DialogFormPost";
import { jwtDecode } from "jwt-decode";

interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
}


interface TokenPayload {
    username: string
}


const PostManagement: React.FC = () => {
    const [tab, setTab] = useState<"my" | "all">("all");
    const [posts, setPosts] = useState<Post[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return;
        }

        const fetchPosts = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getAllPosts();
                setPosts(res.data || []);
            } catch (err: any) {
                setError(err?.message || "Không thể tải bài viết");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const tokenLocal = localStorage.getItem("token") || "";
    const username = jwtDecode<TokenPayload>(tokenLocal);

    const handleSearch = async (keyword: string) => {
        try {
            const res = await searchPosts(keyword);
            setPosts(res);
        } catch (err) {
            console.error("Lỗi tìm kiếm:", err);
         }
    };


    return (
        <Container sx={{ py: 4 }}>
            <Grid  >
                {/* Sidebar chọn tab */}
                <Grid >
                    <Box>
                        <Typography variant="h6" mb={2} fontWeight="bold">
                            Quản lý bài viết
                        </Typography>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton selected={tab === "all"} onClick={() => setTab("all")}>
                                    <ListItemText primary="Tất cả bài viết" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton selected={tab === "my"} onClick={() => setTab("my")}>
                                    <ListItemText primary="Bài viết của tôi" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Grid>

                {/* Content hiển thị */}
                <Grid  >
                    {loading && <CircularProgress />}
                    {error && <Typography color="error">{error}</Typography>}

                    {!loading && !error && (
                        <>
                            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                                <TextField
                                    variant="outlined"
                                    placeholder="Tìm kiếm bài viết..."
                                    size="small"
                                    fullWidth
                                    onChange={(e) => handleSearch(e.target.value)}
                                />

                                <Button
                                    sx={{ height: '40px', width: '150px' }}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        setEditingPost(null);
                                        setOpenDialog(true);
                                    }}
                                >
                                    Tạo bài viết
                                </Button>
                            </Box>

                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Chào mừng bạn đến với bảng tin. Hãy cùng chia sẻ những bài viết thú vị nhé!
                            </Typography>

                            {/* Render bài viết */}
                            {tab === "all" && <AllPost posts={posts} />}
                            {tab === "my" && <MyPost username={username.username} />}
                        </>
                    )}
                </Grid>

            </Grid>
            <DialogFormPost
                open={openDialog}
                editingPost={editingPost}
                onClose={() => setOpenDialog(false)}
                onSave={async (data) => {
                    try {
                        if (editingPost) {
                            await updatePost(editingPost.id, {
                                title: data.title,
                                content: data.content,
                                username: username.username,
                            });
                        } else {
                            await createPost({
                                title: data.title,
                                content: data.content,
                                username: username.username,
                            });
                        }
                        const res = await getAllPosts();
                        setPosts(res.data || []);
                        setOpenDialog(false);
                    } catch (err) {
                        console.error("Lỗi khi lưu bài viết:", err);
                    }
                }}
            />
        </Container>

    );
};

export default PostManagement;
