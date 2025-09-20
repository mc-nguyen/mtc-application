// src/utils/waiverUtils.js

/**
 * Generates initials based on user or parent name.
 * @param {object} formData - The main form data object.
 * @returns {string} The generated initials.
 */
export const generateWaiverInitials = (formData) => {
    const { isAdult, mainInfo } = formData;
    if (isAdult) {
        if (!mainInfo.givenName || !mainInfo.lastName) return '';
        return `${mainInfo.givenName.charAt(0).toUpperCase()}${mainInfo.lastName.charAt(0).toUpperCase()}`;
    } else {
        if (!mainInfo.parentName) return '';
        const parentNameParts = mainInfo.parentName.trim().split(' ');
        if (parentNameParts.length > 1) {
            return `${parentNameParts[0].charAt(0).toUpperCase()}${parentNameParts[parentNameParts.length - 1].charAt(0).toUpperCase()}`;
        }
        return mainInfo.parentName.charAt(0).toUpperCase();
    }
};

/**
 * Validates the WaiverRelease form section.
 * @param {object} formData - The main form data object.
 * @param {object} initials - The state object containing all initials.
 * @param {array} initialSections - Array of sections requiring initials.
 * @returns {boolean} True if the form section is valid, otherwise false.
 */
export const validateWaiver = (formData, initials, initialSections) => {
    const allInitialed = initialSections.every(section => initials[section.initialKey]);
    const hasSignature = !!formData.waiverRelease.signature;
    const hasParentName = formData.isAdult || (formData.mainInfo.parentName && formData.mainInfo.parentName.trim() !== '');

    return allInitialed && hasSignature && hasParentName;
};