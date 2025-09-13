import React, { useState } from "react";
import { Grid, Card, CardContent, Typography, CardActions, Button } from "@mui/material";
import CartPost from "../components/CartPost";

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface Props {
  posts: Post[];
}

const AllPosts: React.FC<Props> = ({ posts }) => {
const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

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
      {posts.map((post) => (
        <Grid sx={{ xs:'6', sm:'3'}} key={post.id}>
          <Card sx={{ borderRadius: 3, boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {post.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {post.content}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Đăng bởi <b>{post.author}</b> • {post.createdAt}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="outlined" onClick={() => handleOpenDetail(post)}>
                  Chi tiết
                </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
            <CartPost open={openDetail} post={selectedPost} onClose={handleCloseDetail} />

    </Grid>
  );
};

export default AllPosts;
