export const urlify = text => {
    const urlBr = /(\r\n|\r|\n)/g;
    return text.split(urlBr)
        .map(part => {
            // if (part.match(urlRegex)) {
            //     return <a href={part}>{part}</a>;
            // }
            if (part.match(urlBr)) {
                return <br />;
            }
            return part;
        });

}

