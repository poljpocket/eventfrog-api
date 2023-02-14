/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */

export class EventfrogUtil {
    /**
     * Returns the localized version of a dictionary of locale-value pairs
     * returns the first found locale if preferred is not available
     * returns null if no locales provided
     *
     * @param versions the dictionary of
     * @param preferredLocale short language string of the preferred locale
     *
     * @return the value in the preferred locale, or the first found. null if no locales provided.
     */
    static getLocalizedString(versions: string[], preferredLocale: string = 'de'): string | null {
        if (Object.keys(versions).length) {
            if (preferredLocale in versions) return versions[preferredLocale];
            return versions[Object.keys(versions)[0]];
        }
        return null;
    }

    /**
     * Creates a URLSearchParams object which supports arrays in the options object
     * The array values are appended without square brackets as the Eventfrog API expects them this way.
     *
     * @param options - the options to turn in
     * @return {URLSearchParams}
     */
    static getSearchParams(options: Object): URLSearchParams {
        const params = new URLSearchParams();
        for (const key in options) {
            const value = options[key];
            if (Array.isArray(value)) { // is array
                for (const i in value) {
                    params.append(key, value[i]);
                }
            } else if (value !== Object(value)) { // is object
                params.append(key, value);
            }
        }
        return params;
    }
}
