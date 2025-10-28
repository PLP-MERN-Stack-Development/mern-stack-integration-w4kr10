import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { postService, categoryService } from '../services/api';

export default function PostList() {
	const [data, setData] = useState({ posts: [], total: 0 });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [category, setCategory] = useState('');
	const [categories, setCategories] = useState([]);
	const [page, setPage] = useState(1);
	const [limit] = useState(5);
	const [search, setSearch] = useState('');
	const [q, setQ] = useState('');
	const debounceRef = useRef(null);

	// Load categories once
	useEffect(() => {
		(async () => {
			try {
				const catsRes = await categoryService.getAllCategories();
				setCategories(catsRes.data || []);
			} catch (e) {
				// ignore categories error on first load
			}
		})();
	}, []);

	// Load posts when filters change
	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				setError(null);
				if (q) {
					const res = await postService.searchPosts(q);
					setData({ posts: res.data || [], total: (res.data || []).length });
				} else {
					const postsRes = await postService.getAllPosts(page, limit, category || null);
					setData({ posts: postsRes.data || [], total: postsRes.pagination?.total || 0 });
				}
			} catch (e) {
				setError(e.message || 'Failed to load posts');
			} finally {
				setLoading(false);
			}
		})();
	}, [page, limit, category, q]);

	const totalPages = useMemo(() => Math.max(1, Math.ceil((data.total || 0) / limit)), [data.total, limit]);

	const onSearchChange = (val) => {
		setSearch(val);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			setQ(val.trim());
			setPage(1);
		}, 300);
	};

	const onCategoryChange = (val) => {
		setCategory(val);
		setPage(1);
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p style={{ color: 'red' }}>{error}</p>;

	return (
		<section>
			<div style={{ marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
				<label>
					Category:&nbsp;
					<select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
						<option value="">All</option>
						{categories.map((c) => (
							<option key={c._id} value={c._id}>{c.name}</option>
						))}
					</select>
				</label>
				<input
					placeholder="Search posts..."
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					style={{ flex: 1, padding: 8 }}
				/>
			</div>
			<ul style={{ display: 'grid', gap: 12, padding: 0, listStyle: 'none' }}>
				{data.posts.map((p) => (
					<li key={p._id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
						<h3 style={{ margin: '0 0 6px' }}>
							<Link to={`/posts/${p._id}`}>{p.title}</Link>
						</h3>
						<p style={{ margin: 0 }}>{p.excerpt || (p.content ? `${p.content.slice(0, 140)}...` : '')}</p>
					</li>
				))}
			</ul>
			{!q && (
				<div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 16 }}>
					<button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
					<span>Page {page} / {totalPages}</span>
					<button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
				</div>
			)}
		</section>
	);
}


