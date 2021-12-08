// original source for this method: https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= ((window.innerHeight + rect.height) || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

$("#main-container").on('scroll', (e) => {
    if (isInViewport($("#fast-minting")[0])) {
        $("#fast-minting").addClass("animParag");
    }
    if (isInViewport($("#reliable-market")[0])) {
        $("#reliable-market").addClass("animParag");
    }
    if (isInViewport($("#secure")[0])) {
        $("#secure").addClass("animParag");
    }
    if (isInViewport($("#transparent-team")[0])) {
        $("#transparent-team").addClass("animParag");
    }
    if (isInViewport($("#perks")[0])) {
        $("#perks").addClass("animParag");
    }
    if (isInViewport($("#fees")[0])) {
        $("#fees").addClass("animParag");
    }
});