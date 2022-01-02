export function capitalize(string_value: string): string {
    if (typeof string_value === 'string') {
        return string_value.replace(/^./, string_value[0].toUpperCase());
    }
    else {
        return ""
    }

}