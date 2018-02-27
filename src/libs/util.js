let util = {};
util.title = function (title) {
    title = title ? title : 'OTCMAKER';
    window.document.title = title;
};

export default util;