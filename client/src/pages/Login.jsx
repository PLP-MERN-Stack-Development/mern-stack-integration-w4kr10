import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

export default function Login() {
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || '/';
	const [form, setForm] = useState({ email: '', password: '' });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			setError(null);
			await authService.login(form);
			navigate(from, { replace: true });
		} catch (e) {
			setError(e.response?.data?.error || e.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 360, margin: '24px auto' }}>
			<h2>Login</h2>
			<label>
				Email
				<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
			</label>
			<label>
				Password
				<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
			</label>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
			<p style={{ margin: 0 }}>No account? <Link to="/register">Register</Link></p>
		</form>
	);
}


