/**
 * @jest-environment jsdom
 */

describe('Theme Toggle Logic', () => {
    let isDarkMode;
    let documentBody;

    beforeEach(() => {
        // Reset state
        isDarkMode = false;
        document.body.className = '';
        documentBody = document.body;
    });

    function updateTheme(darkMode) {
        if (darkMode) {
            documentBody.classList.add('dark-mode');
            documentBody.classList.remove('light-mode');
        } else {
            documentBody.classList.add('light-mode');
            documentBody.classList.remove('dark-mode');
        }
    }

    test('should apply dark-mode class when isDarkMode is true', () => {
        isDarkMode = true;
        updateTheme(isDarkMode);
        expect(documentBody.classList.contains('dark-mode')).toBe(true);
        expect(documentBody.classList.contains('light-mode')).toBe(false);
    });

    test('should apply light-mode class when isDarkMode is false', () => {
        isDarkMode = false;
        updateTheme(isDarkMode);
        expect(documentBody.classList.contains('light-mode')).toBe(true);
        expect(documentBody.classList.contains('dark-mode')).toBe(false);
    });

    test('should toggle classes correctly', () => {
        // Start Light
        isDarkMode = false;
        updateTheme(isDarkMode);
        expect(documentBody.classList.contains('light-mode')).toBe(true);

        // Switch to Dark
        isDarkMode = true;
        updateTheme(isDarkMode);
        expect(documentBody.classList.contains('dark-mode')).toBe(true);
        expect(documentBody.classList.contains('light-mode')).toBe(false);
    });
});
