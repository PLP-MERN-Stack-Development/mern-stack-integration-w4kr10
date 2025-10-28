import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PostList from './pages/PostList.jsx';
import PostDetail from './pages/PostDetail.jsx';
import PostForm from './pages/PostForm.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { AppProvider } from './context/AppContext.jsx';

export default function App() {
	return (
		<AppProvider>
			<Nav />
			<main style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
				<Routes>
					<Route path="/" element={<PostList />} />
					<Route path="/posts/:id" element={<PostDetail />} />
					<Route path="/create" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />
					<Route path="/edit/:id" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</main>
		</AppProvider>
	);
}


