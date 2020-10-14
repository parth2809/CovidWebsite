function updateSidebar(visible) {
    let buttons = document.getElementById("buttons-sidebar")
    let map = document.getElementById("map")

    if (visible == true) {
        buttons.removeAttribute("style","display:none;");
        map.setAttribute("style","height: 28rem !important");
        mapChart.reflow()
    } else {
        buttons.setAttribute("style","display:none;");
        map.setAttribute("style","height: 40rem !important");
        mapChart.reflow()
    }
}