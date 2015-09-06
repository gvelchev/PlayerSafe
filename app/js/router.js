require.config({
    baseUrl: chrome.extension.getURL("/js/"),
    paths: {
        'netflix': 'content/netflix',
    }
});

switch(true) {
    case /.*:\/\/(www\.)?netflix\.com\/.*/i.test(window.location.href):
        require(['netflix']);
        break;
    default:
}