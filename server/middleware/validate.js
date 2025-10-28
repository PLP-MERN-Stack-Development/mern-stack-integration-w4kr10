// validate.js - Helper for express-validator results

const { validationResult } = require('express-validator');

exports.validate = (validations) => {
	return async (req, res, next) => {
		for (let validation of validations) {
			const result = await validation.run(req);
			if (result.errors.length) break;
		}

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}
		next();
	};
};


