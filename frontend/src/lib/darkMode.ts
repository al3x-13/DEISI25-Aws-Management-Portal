const LOCAL_STORAGE_KEY = 'theme';

/**
 * Gets the light mode saved preference.
 * @returns 'dark', 'light' or null
 */
function getLightModePreference(): string | null {
    let preference = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (preference == null || preference == 'light' || preference == 'dark') {
        return preference;
    }
    return null;
}

/**
 * Sets light mode ('light' or 'dark') preference in local storage.
 * @param mode desired mode
 */
function setLightModePreference(mode: string) {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, mode);
}

/**
 * Switches light mode on.
 */
export function setLightMode() {
    setLightModePreference('light');
    document.documentElement.classList.remove('dark');
}

/**
 * Switches dark mode on.
 */
export function setDarkMode() {
    setLightModePreference('dark');
    document.documentElement.classList.add('dark');
}

/**
 * Gets dark mode state.
 * @returns Whether dark mode is active
 */
export function darkModeActive(): boolean {
    return document.documentElement.classList.contains('dark');
}
