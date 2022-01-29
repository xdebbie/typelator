// Breakpoints
export const size = {
    tablet: '767px',
    mobileTablet: '1023px',
    desktop: '1024px',
}

export const device = {
    smartphone: `(max-width: ${size.tablet})`,
    tablet: `(min-width: ${size.tablet})`,
    mobileTablet: `(max-width: ${size.mobileTablet})`,
    desktop: `(min-width: ${size.desktop})`,
}
