module.exports.configure = (logger, mail) => {
    process.on('unhandledRejection', error => {
        logger.error('Unhandled promise rejection', {
            meta: {
                "timestamp": new Date().toLocaleString(),
                "errorName": error.name,
                "errorMessage": error.message,
                "errorStack": error.stack
            }
        });
    });
    
    process.on('uncaughtException', error => {
        logger.error('Uncaught error occured', {
            meta: {
                "timestamp": new Date().toLocaleString(),
                "errorName": error.name,
                "errorMessage": error.message,
                "errorStack": error.stack
            }
        });
    });
    
    process.on('exit', async code => {
        logger.error(`Process exited with code ${code}`);
        await mail.sendMail('admin <ADMIN@GMAIL.COM>', 'node.js.developers.kh@gmail.com', 'Your app goes down', '<h1>please go there</h1>');
    });
};