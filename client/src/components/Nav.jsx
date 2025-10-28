import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Nav() {
	const navigate = useNavigate();
	const isAuthed = typeof window !== 'undefined' && !!localStorage.getItem('token');
	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		navigate('/');
	};
	const linkStyle = ({ isActive }) => ({
		padding: 6,
		borderRadius: 6,
		textDecoration: 'none',
		background: isActive ? '#efefef' : 'transparent',
	});
	return (
		<header style={{ borderBottom: '1px solid #ddd', marginBottom: 16 }}>
			<nav style={{ display: 'flex', gap: 12, padding: 12, alignItems: 'center' }}>
				<Link to="/" style={{ fontWeight: 700, textDecoration: 'none' }}>MERN Blog</Link>
				<NavLink to="/" end style={linkStyle}>Posts</NavLink>
				<NavLink to="/create" style={linkStyle}>New Post</NavLink>
				<div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
					{!isAuthed ? (
						<>
							<NavLink to="/login" style={linkStyle}>Login</NavLink>
							<NavLink to="/register" style={linkStyle}>Register</NavLink>
						</>
					) : (
						<button onClick={logout}>Logout</button>
					)}
				</div>
			</nav>
		</header>
	);
}


