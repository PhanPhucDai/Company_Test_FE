import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, CardActions, Button, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import CartPost from "../components/CartPost";
import { createPost, deletePost, getMyPosts, updatePost } from "../services/PostService";
import DialogFormPost from "../components/DialogFormPost";
import { useAlert } from "../utils/Alert";


interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface Props {
  username: string;
}

const MyPosts: React.FC<Props> = ({ username }) => {
  const { showAlert } = useAlert();

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      const data = await getMyPosts(username);
      setMyPosts(data.data);
    } catch (err: any) {
      setError(err.message || "Lỗi khi lấy bài viết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [username]);


  const handleOpenDetail = (post: Post) => {
    setSelectedPost(post);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setSelectedPost(null);
    setOpenDetail(false);
  };

  return (
    <Grid container spacing={3}>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {myPosts.map((post) => (
        <Grid sx={{ xs: '12', sm: '6' }} key={post.id}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              maxWidth: 400,
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
                Đăng bởi <b>{post.author}</b> • {post.createdAt}
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
                username: username,
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
        <DialogContent>Bạn có chắc chắn muốn xóa bài viết này không?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              if (!postToDelete) return;
              try {
                await deletePost(postToDelete.id);
                fetchPosts()
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
  );
};

export default MyPosts;
