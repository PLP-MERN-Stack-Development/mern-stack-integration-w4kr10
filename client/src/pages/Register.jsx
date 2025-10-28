import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

export default function Register() {
	const navigate = useNavigate();
	const [form, setForm] = useState({ name: '', email: '', password: '' });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			setError(null);
			await authService.register(form);
			navigate('/');
		} catch (e) {
			setError(e.response?.data?.error || e.message || 'Registration failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 360, margin: '24px auto' }}>
			<h2>Register</h2>
			<label>
				Name
				<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
			</label>
			<label>
				Email
				<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
			</label>
			<label>
				Password
				<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
			</label>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
			<p style={{ margin: 0 }}>Have an account? <Link to="/login">Login</Link></p>
		</form>
	);
}


