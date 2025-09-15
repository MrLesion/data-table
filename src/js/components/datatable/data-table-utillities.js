const getBootstrapBreakpoints = () => {
    const root = getComputedStyle(document.documentElement);
    return {
        sm: `(min-width: ${root.getPropertyValue('--bs-breakpoint-sm').trim()})`,
        md: `(min-width: ${root.getPropertyValue('--bs-breakpoint-md').trim()})`,
        lg: `(min-width: ${root.getPropertyValue('--bs-breakpoint-lg').trim()})`,
        xl: `(min-width: ${root.getPropertyValue('--bs-breakpoint-xl').trim()})`,
        xxl: `(min-width: ${root.getPropertyValue('--bs-breakpoint-xxl').trim()})`
    };
}
const matchesBreakpoint = (bp) => {
    const breakpoints = getBootstrapBreakpoints();
    if (!(bp in breakpoints)){
        return false;
    }
    return window.matchMedia(breakpoints[bp]).matches;
}

export{
    matchesBreakpoint
}