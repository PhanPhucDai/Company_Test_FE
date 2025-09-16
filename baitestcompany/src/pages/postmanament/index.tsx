import React, { useState, useEffect } from "react";
import { Container, Grid, List, ListItem, ListItemButton, ListItemText, Box, Typography, CircularProgress, TextField, Button, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useAlert } from "../../untils/notice";
import { createPost, deletePost, getAllPosts, getMyPosts, searchPosts, updatePost } from "../../services/postservice";
import CartPost from "../../components/cartpost";
import DialogFormPost from "../../components/dialogformpost";

interface Post {
    id: number;
    title: string;
    content: string;
    author: {
        fullName: string;
    };
    createdAt: string;
}


interface TokenPayload {
    username: string
}


const PostManagement: React.FC = () => {
    const [tab, setTab] = useState<"my" | "all">("all");
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchMyPosts = async () => {
        try {
            const data = await getMyPosts(username.username);
            setPosts(data.data);
        } catch (err: any) {
            setError(err.message || "Lỗi khi lấy bài viết");
        } finally {
            setLoading(false);
        }
    };

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

    useEffect(() => {
        setPosts([]);
        const token = localStorage.getItem("token");
        if (!token || null) {
            window.location.href = "/login";
            return;
        }

        if (tab === "my") {
            fetchMyPosts();
        } else {
            fetchPosts();
        }

    }, [tab]);

    const tokenLocal = localStorage.getItem("token") || "";
    let username: any;
    try {
        username = jwtDecode<TokenPayload>(tokenLocal);
    } catch (err) {
        window.location.href = "/login";
    }

    const handleSearch = async (keyword: string) => {
        try {
            const res = await searchPosts(keyword);
            setPosts(res);
        } catch (err) {
            console.error("Lỗi tìm kiếm:", err);
        }
    };

    const { showAlert } = useAlert();

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [openDetail, setOpenDetail] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");



    const handleOpenDetail = (post: Post) => {
        setSelectedPost(post);
        setOpenDetail(true);
    };

    const handleCloseDetail = () => {
        setSelectedPost(null);
        setOpenDetail(false);
    };

    return (
        <Container sx={{ py: 4 }}>
            <Grid  >
                {/* Sidebar chọn tab */}
                <Grid>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight="bold">
                            Quản lý bài viết
                        </Typography>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                localStorage.removeItem("token");
                                window.location.href = "/login";
                            }}
                        >
                            Đăng xuất
                        </Button>
                    </Box>

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
                </Grid>

                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <TextField
                        variant="outlined"
                        placeholder="Tìm kiếm bài viết..."
                        size="small"
                        fullWidth
                        onChange={(e) => handleSearch(e.target.value)} />

                    <Button
                        sx={{ height: '40px', width: '150px' }}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setEditingPost(null);
                            setOpenDialog(true);
                        }}>
                        Tạo bài viết
                    </Button>
                </Box>


                {/* Content hiển thị */}
                <Grid  >
                    {loading && <CircularProgress />}
                    {error && <Typography color="error">{error}</Typography>}
                    {!loading && !error && (
                        <>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Chào mừng bạn đến với bảng tin. Hãy cùng chia sẻ những bài viết thú vị nhé!
                            </Typography>

                            {/* Render bài viết */}
                            <Grid container spacing={3}>
                                {loading && <CircularProgress />}
                                {error && <Typography color="error">{error}</Typography>}

                                {posts.map((post) => (
                                    <Grid sx={{ xs: '12', sm: '6' }} key={post.id}>
                                        <Card
                                            sx={{
                                                borderRadius: 3,
                                                boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                                                maxWidth: 365,
                                                minWidth: 300,
                                            }}
                                        >
                                            <CardContent>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    sx={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {post.title}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {post.content}
                                                </Typography>

                                                <Typography variant="caption" color="text.secondary">
                                                    Đăng bởi <b>{post.author.fullName}</b> • {post.createdAt}
                                                </Typography>
                                            </CardContent>

                                            <CardActions sx={{ justifyContent: "space-between" }}>
                                                <Button
                                                    size="medium"
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{
                                                        borderRadius: 2,
                                                        textTransform: "none",
                                                        fontWeight: 600,
                                                        "&:hover": { backgroundColor: "#1976d2cc" },
                                                    }}
                                                    onClick={() => handleOpenDetail(post)}
                                                >
                                                    Chi tiết
                                                </Button>
                                                {tab === 'my' ? (
                                                    <Box sx={{ display: "flex", gap: 1 }}>
                                                        <Button
                                                            size="medium"
                                                            variant="outlined"
                                                            color="secondary"
                                                            sx={{
                                                                borderRadius: 2,
                                                                textTransform: "none",
                                                                fontWeight: 600,
                                                                "&:hover": { backgroundColor: "#f5f5f5" },
                                                            }}
                                                            onClick={() => {
                                                                setEditingPost(post);
                                                                setOpenDialog(true);
                                                            }}
                                                        >
                                                            Sửa
                                                        </Button>

                                                        <Button
                                                            size="medium"
                                                            variant="contained"
                                                            color="error"
                                                            sx={{
                                                                borderRadius: 2,
                                                                textTransform: "none",
                                                                fontWeight: 600,
                                                                "&:hover": { backgroundColor: "#d32f2fcc" },
                                                            }}
                                                            onClick={() => {
                                                                setPostToDelete(post);
                                                                setOpenConfirm(true);
                                                            }}
                                                        >
                                                            Xóa
                                                        </Button>
                                                    </Box>
                                                ) : null}


                                            </CardActions>
                                        </Card>

                                    </Grid>
                                ))}
                                <CartPost open={openDetail} post={selectedPost} onClose={handleCloseDetail} />
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
                                            }
                                            fetchPosts()
                                            setOpenDialog(false);
                                        } catch (err) {
                                            console.error("Lỗi khi lưu bài viết:", err);
                                        }
                                    }}
                                />
                                <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                                    <DialogTitle>Xác nhận xóa</DialogTitle>
                                    <DialogContent>Bạn có chắc chắn muốn xóa bài viết: <b>"{postToDelete?.title}"</b> này không?</DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
                                        <Button
                                            color="error"
                                            variant="contained"
                                            onClick={async () => {
                                                if (!postToDelete) return;
                                                try {
                                                    await deletePost(postToDelete.id);
                                                    const data = await getMyPosts(username.username);
                                                    setPosts(data.data);
                                                    showAlert("Xóa bài viết thành công!", "success");
                                                } catch (err) {
                                                    console.error(err);
                                                    showAlert("Xóa bài viết thất bại!", "error");
                                                } finally {
                                                    setOpenConfirm(false);
                                                }
                                            }}
                                        >
                                            Xóa
                                        </Button>
                                    </DialogActions>
                                </Dialog>

                            </Grid>
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
                        if (tab === 'my') {
                            const res = await getMyPosts(username.username);
                            setPosts(res.data || []);
                        } else {
                            const res = await getAllPosts();
                            setPosts(res.data || []);
                        }

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
