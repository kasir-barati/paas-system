module.exports.isEmail = email => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);

/**
 * /^
 * (?=.*\d)          // should contain at least one digit
 * (?=.*[a-z])       // should contain at least one lower case
 * (?=.*[A-Z])       // should contain at least one upper case
 * [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters
 * $/
 */
module.exports.isPassword = password => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(password);

module.exports.isSmallerThan = (str, length) => str.length < length;

module.exports.isGreaterThan = (str, length) => str.length > length;
    
module.exports.isAlpha = str => /[a-zA-Z\u0600-\u06FF\s]+/.test(str);

module.exports.isAlphanumeric = str => /[a-zA-Z0-9\s]+/.test(str);
    
module.exports.isIranianPhoneNumber = str => /(0|\+98)?([ ]|,|-|[()]){0,2}9[0|1|2|3|4]([ ]|,|-|[()]){0,2}(?:[0-9]([ ]|,|-|[()]){0,2}){8}/.test(this.val);

module.exports.isNumeric = num => !isNaN(parseFloat(num)) && isFinite(num);

module.exports.isUrl = url => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(url);

module.exports.compare = (str1, str2) => str1.localeCompare(str2);