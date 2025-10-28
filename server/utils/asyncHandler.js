// asyncHandler - Wraps async route handlers to forward errors

module.exports = function asyncHandler(handler) {
	return (req, res, next) => {
		Promise.resolve(handler(req, res, next)).catch(next);
	};
};


