export function darkModeActive(): boolean {
    return document.documentElement.classList.contains('dark');
}

// TODO
// - Dark mode toggle functionality
// - Save preference (localstorage)