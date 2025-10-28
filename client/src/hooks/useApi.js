import { useCallback, useState } from 'react';

export default function useApi(apiFn) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);

	const call = useCallback(async (...args) => {
		try {
			setLoading(true);
			setError(null);
			const result = await apiFn(...args);
			setData(result);
			return result;
		} catch (e) {
			setError(e);
			throw e;
		} finally {
			setLoading(false);
		}
	}, [apiFn]);

	return { call, loading, error, data };
}


