module.exports.configure = (logger, mail) => {
    process.on('unhandledRejection', (error) => {
        logger.error('Unhandled promise rejection', {
            meta: {
                timestamp: new Date().toLocaleString(),
                error: error,
            },
        });
    });

    process.on('uncaughtException', (error) => {
        logger.error('Uncaught error occured', {
            meta: {
                timestamp: new Date().toLocaleString(),
                error: error,
            },
        });
    });

    process.on('exit', async (code) => {
        logger.error(`Process exited with code ${code}`);
        await mail.sendMail(
            'noreply@talashnet.info',
            'node.js.developers.kh@gmail.com',
            'Your app goes down',
            '<h1>please go there</h1>',
        );
    });
};
