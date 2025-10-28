import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../services/api';

export default function PostDetail() {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const res = await postService.getPost(id);
				setPost(res.data);
			} catch (e) {
				setError(e.message || 'Failed to load post');
			} finally {
				setLoading(false);
			}
		})();
	}, [id]);

	if (loading) return <p>Loading...</p>;
	if (error) return <p style={{ color: 'red' }}>{error}</p>;
	if (!post) return <p>Not found</p>;

	return (
		<article>
			<h2>{post.title}</h2>
			<p>{post.content}</p>
		</article>
	);
}


