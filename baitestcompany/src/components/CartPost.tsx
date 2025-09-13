import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from "@mui/material";

interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
}

interface CartPostProps {
    open: boolean;
    post: Post | null;
    onClose: () => void;
}

const CartPost: React.FC<CartPostProps> = ({ open, post, onClose }) => {
    if (!post) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{post.title}</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1" gutterBottom>
                    {post.content}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Đăng bởi <b>{post.author}</b> • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Chưa có ngày"}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Đóng</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CartPost;
