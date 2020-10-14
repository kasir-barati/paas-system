/**
 * Route: UnverifiedTransactions [module]
 * @return {Object} authorities [List of Unverified transactions]
 */
app.get('/unverified-transactions', async (req, res) => {
	try {
		const response = await zarinpal.UnverifiedTransactions();

		if (response.status == 100) {
			console.log(response);
		};
	} catch (error) {
		console.error(error);
	};
});


/**
 * Route: Refresh Authority [module]
 * @param {number} expire [(1800 / 60) = 30min]
 * @return {String} status [Status of Authority]
 */
app.get('/refresh-authority/:expire/:token', async (req, res) => {
	try {
		const response = await zarinpal.RefreshAuthority({
			Authority: req.params.token,
			Expire: req.params.expire
		});

		if (response.status == 100) {
			console.log('/unverified-transactions');
			res.send('<h2>You can Use: <u>' + req.params.token + '</u> — Expire in: <u>' + req.params.expire + '</u></h2>');
		};
	} catch (error) {
		console.log(error);
	};
});