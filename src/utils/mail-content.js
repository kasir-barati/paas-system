const path = require('path');
const { promises: fsPromises } = require('fs');

/**
 * Email activation content
 * @param {string} token Email activation token
 * @return {string} emailContent
 */
module.exports.emailActivationContent = async (uiBaseUrl, token) => {
    let emailContent = await fsPromises.readFile(path.join(__dirname, '..', 'files', 'html-templates', 'email-activation.html'));

    emailContent = emailContent.toString();
    emailContent = emailContent.replace(/TOKEN/g, token);
    // emailContent = emailContent.replace(/APP_NAME/g, token);
    emailContent = emailContent.replace(/UI_BASE_URL/g, uiBaseUrl);
    // emailContent = emailContent.replace(/SUPPORT_MAIL/g, token);

    return { emailContent };
};

/**
 * Password reset content
 * @param {string} newPassword New password
 */
module.exports.passwordResetContent = async newPassword => {
    let emailContent = await fsPromises.readFile(path.join(__dirname, '..', '..', 'public', 'html', 'password-reset.html'));

    emailContent = emailContent.toString();
    emailContent = emailContent.replace(/newPassword/g, newPassword);

    return { emailContent };
};