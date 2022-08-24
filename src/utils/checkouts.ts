export const emailValid = (email: string) => {
    if (!email) return false;
    return email.toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

export const usernameValid = (username: string) => {
    if (!username) return false;
    return !username.includes(' ') && username.length > 3 && !username.includes('#') && !username.includes('%');
}

export const characterNameValid = (name: string) => {
    const match = name.match(/[A-Z]+?[a-z]{1,}/g);
    return match?.at(0)?.length == name.length;
}