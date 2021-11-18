/**
 * @author Julian Pollak <poljpocket@gmail.com>
 */
class EventFrogUtil {
    /**
     * Returns the localized version of a dictionary of locale-value pairs
     * returns the first found locale if preferred is not available
     * returns null if no locales provided
     *
     * @param {string[]} versions the dictionary of
     * @param {string} preferredLocale short language string of the preferred locale
     *
     * @return {string|null} the value in the preferred locale, or the first found. null if no locales provided.
     */
    static getLocalizedString(versions, preferredLocale = 'de') {
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
     * @param {Object} options - the options to turn in
     * @return {URLSearchParams}
     */
    static getSearchParams(options) {
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

module.exports = EventFrogUtil;
