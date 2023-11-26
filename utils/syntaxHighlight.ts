export function syntaxHighlight(json: string) {
    // First, escape HTML characters to prevent XSS attacks.
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Use a regular expression to identify and wrap different parts of the JSON string.
    return json.replace(/("(\\u[\dA-Fa-f]{4}|\\[^u]|[^\\"])*"(\s*:)?|true|false|null|-?\d+(\.\d+)?([eE][+-]?\d+)?)/g, function(match) {
        let cls = 'number'; // Default class is 'number'

        if (/^"/.test(match)) {
            // If the string starts with a quote, it's either a key or a string value.
            if (/:$/.test(match)) {
                // If it ends with a colon, it's a key.
                cls = 'key';
            } else {
                // Otherwise, it's a string value.
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            // If the match is 'true' or 'false', it's a boolean.
            cls = 'boolean';
        } else if (/null/.test(match)) {
            // If the match is 'null', use the 'null' class.
            cls = 'null';
        }
        // Wrap the matched text in a span element with the appropriate class.
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
