export function linkify(text) {
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
        var n = text.indexOf('<a href="' + url + '"');
        if( n >= 0 )
            return url;
        
        return '<a href="' + url + '">' + url + '</a>';
    });
}

export function getNextDate(date, occurence) {
    // {label: 'Twice a week', value: '1'},
    // {label: 'Once a week', value: '2'},
    // {label: 'Every 2 weeks', value: '3'},
    // {label: 'Once a month', value: '4'},
}