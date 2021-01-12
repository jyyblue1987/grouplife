export function linkify(text) {
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
        var n = text.indexOf('<a href="' + url + '"');
        if( n >= 0 )
            return url;
        
        return '<a href="' + url + '">' + url + '</a>';
    });
}