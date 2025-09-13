import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useAlert } from "../utils/Alert";
 
interface DialogFormPostProps {
  open: boolean;
  onClose: () => void;
  onSave: (post: { title: string; content: string; id?: number }) => void;
  editingPost?: { id: number; title: string; content: string } | null;
}

const DialogFormPost = ({ open, onClose, onSave, editingPost }: DialogFormPostProps) => {
  const [title, setTitle] = useState(editingPost?.title || "");
  const [content, setContent] = useState(editingPost?.content || "");
  const { showAlert } = useAlert();

  useEffect(() => {
    setTitle(editingPost?.title || "");
    setContent(editingPost?.content || "");
  }, [editingPost]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      showAlert("Vui lòng điền đầy đủ tiêu đề và nội dung!", "warning");
      return;
    }

    try {
      onSave({ id: editingPost?.id, title, content });
      showAlert(editingPost ? "Cập nhật bài viết thành công!" : "Tạo bài viết thành công!", "success");

      if (!editingPost) {
        setTitle("");
        setContent("");
      }

      onClose();
    } catch (err) {
      console.error(err);
      showAlert("Lưu bài viết thất bại!", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editingPost ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Tiêu đề"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Nội dung"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSave}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogFormPost;
