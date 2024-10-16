// ActivityLogic.js
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const useActivityLogic = (initialPosts) => {
    const [postContent, setPostContent] = useState("");
    const [postImages, setPostImages] = useState([]);
    const [postImageUrls, setPostImageUrls] = useState([]);
    const [posts, setPosts] = useState(initialPosts);
    const [postId, setPostId] = useState(null);
    const userId = Cookies.get("UserID");
    const [commentContent, setCommentContent] = useState({});
    const [showAllComments, setShowAllComments] = useState({});
    const [replyContent, setReplyContent] = useState({});
    const [replyingTo, setReplyingTo] = useState({});
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState("");
    const [showAllReplies, setShowAllReplies] = useState({});

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleToggleReplies = (commentId) => {
        setShowAllReplies((prev) => ({
            ...prev,
            [commentId]: !prev[commentId], // Chuyển đổi trạng thái hiển thị reply
        }));
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/posts/current-user`,
                { params: { userId }, withCredentials: true }
            );

            const sortedPosts = response.data.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB - dateA;
            });

            const postsWithCommentsAndReplies = await Promise.all(
                sortedPosts.map(async (post) => {
                    const commentsResponse = await axios.get(
                        `http://localhost:8080/api/comments/post/${post.id}`
                    );

                    const commentsWithReplies = await Promise.all(
                        commentsResponse.data.map(async (comment) => {
                            const repliesResponse = await axios.get(
                                `http://localhost:8080/api/replies/comment/${comment.id}`
                            );
                            return { ...comment, replies: repliesResponse.data };
                        })
                    );

                    return { ...post, comments: commentsWithReplies };
                })
            );

            setPosts(postsWithCommentsAndReplies);
        } catch (error) {
            console.error("Error fetching user posts:", error);
        }
    };

    const resetForm = () => {
        setPostContent("");
        setPostImages([]);
        setPostImageUrls([]);
        setPostId(null);
    };

    const handleSubmitPost = async () => {
        const formData = new FormData();
        formData.append("content", postContent || "");
        formData.append("userId", userId);

        postImages.forEach((image) => {
            formData.append("images", image);
        });

        try {
            if (postId) {
                await axios.put(`http://localhost:8080/api/posts/${postId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                });
            } else {
                await axios.post("http://localhost:8080/api/posts", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                });
            }
            resetForm();
            fetchPosts();
        } catch (error) {
            console.error("Error creating/updating post:", error);
        }
    };

    const handleDeletePost = async (postId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
                withCredentials: true,
            });
            fetchPosts();
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleEditPost = (post) => {
        setPostContent(post.content);
        setPostImages(post.images);
        setPostId(post.id);
    };

    const handleAddComment = async (postId) => {
        const content = commentContent[postId] || "";
        if (!content.trim()) return;

        try {
            const response = await axios.post(
                `http://localhost:8080/api/comments/post/${postId}/user/${userId}`,
                { content: content }
            );

            setPosts((prevPosts) =>
                prevPosts.map((post) => {
                    if (post.id === postId) {
                        return { ...post, comments: [...post.comments, response.data] };
                    }
                    return post;
                })
            );

            setCommentContent((prev) => ({ ...prev, [postId]: "" }));
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleCommentChange = (postId, value) => {
        setCommentContent((prev) => ({ ...prev, [postId]: value }));
    };

    const handleDeleteComment = async (commentId, postId) => {
        try {
            await axios.delete(`http://localhost:8080/api/comments/${commentId}`);
            setPosts((prevPosts) =>
                prevPosts.map((post) => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            comments: post.comments.filter((comment) => comment.id !== commentId),
                        };
                    }
                    return post;
                })
            );
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleToggleComments = (postId) => {
        setShowAllComments((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId],
        }));
    };

    const handleUpdateComment = async (commentId, postId) => {
        if (!editingCommentContent.trim()) return;

        try {
            await axios.put(`http://localhost:8080/api/comments/${commentId}`, {
                content: editingCommentContent,
                edited: true,
            });

            setPosts((prevPosts) =>
                prevPosts.map((post) => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            comments: post.comments.map((comment) => {
                                if (comment.id === commentId) {
                                    return {
                                        ...comment,
                                        content: editingCommentContent,
                                        edited: true,
                                    };
                                }
                                return comment;
                            }),
                        };
                    }
                    return post;
                })
            );

            setEditingCommentId(null);
            setEditingCommentContent("");
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    const handleReplyChange = (commentId, value) => {
        setReplyContent((prev) => ({ ...prev, [commentId]: value }));
    };

    const handleReplyClick = (commentId) => {
        setReplyingTo((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    const handleAddReply = async (commentId, postId) => {
        const content = replyContent[commentId] || "";
        if (!content.trim()) return;

        try {
            const response = await axios.post(
                `http://localhost:8080/api/replies/comment/${commentId}/user/${userId}`,
                { content: content },
                { withCredentials: true }
            );

            setPosts((prevPosts) =>
                prevPosts.map((post) => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            comments: post.comments.map((comment) => {
                                if (comment.id === commentId) {
                                    return {
                                        ...comment,
                                        replies: [...(comment.replies || []), response.data],
                                    };
                                }
                                return comment;
                            }),
                        };
                    }
                    return post;
                })
            );

            setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
            setReplyingTo((prev) => ({ ...prev, [commentId]: false }));
        } catch (error) {
            console.error("Error adding reply:", error);
        }
    };

    return {
        posts,
        setPosts,
        postContent,
        setPostContent,
        postImages,
        setPostImages,
        commentContent,
        setCommentContent,
        editingCommentId,
        setEditingCommentId,
        editingCommentContent,
        setEditingCommentContent,
        replyingTo,
        setReplyingTo,
        replyContent,
        setReplyContent,
        showAllComments,
        handleSubmitPost,
        handleEditPost,
        handleDeletePost,
        handleAddComment,
        handleCommentChange,
        handleDeleteComment,
        handleToggleComments,
        handleUpdateComment,
        handleReplyChange,
        handleReplyClick,
        handleAddReply,
        showAllReplies,
        handleToggleReplies,
    };
};

export default useActivityLogic;
