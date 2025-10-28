import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService, categoryService } from '../services/api';

export default function PostForm() {
	const navigate = useNavigate();
	const { id } = useParams();
	const isEdit = Boolean(id);
	const [categories, setCategories] = useState([]);
	const [form, setForm] = useState({ title: '', content: '', category: '' });
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		(async () => {
			const cats = await categoryService.getAllCategories();
			setCategories(cats.data || []);
			if (isEdit) {
				const res = await postService.getPost(id);
				const p = res.data;
				setForm({ title: p.title || '', content: p.content || '', category: p.category?._id || '' });
			}
		})();
	}, [id, isEdit]);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setSaving(true);
			if (isEdit) {
				await postService.updatePost(id, form);
			} else {
				await postService.createPost(form);
			}
			navigate('/');
		} catch (e) {
			setError(e.message || 'Failed to save');
		} finally {
			setSaving(false);
		}
	};

	return (
		<form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
			<h2>{isEdit ? 'Edit' : 'Create'} Post</h2>
			<label>
				Title
				<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
			</label>
			<label>
				Content
				<textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
			</label>
			<label>
				Category
				<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
					<option value="" disabled>Select category</option>
					{categories.map((c) => (
						<option key={c._id} value={c._id}>{c.name}</option>
					))}
				</select>
			</label>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
		</form>
	);
}


