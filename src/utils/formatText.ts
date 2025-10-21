export function formatBoldText(text: string) {
    return text.replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>');
}

export function cleanText(text: string) {
    return text.replace(/<\/?strong>/g, '').replace(/\*\*(.*?)\*\*|__(.*?)__/g, '$1$2');
}