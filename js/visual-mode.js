export function setVisualMode() {
    const visualMode = sessionStorage.getItem("visualMode")
    if (!visualMode || visualMode == "light"){
        document.body.className = "lightMode"
        document.body.innerHTML = document.body.innerHTML.replaceAll("assets/dark-mode/", "assets/light-mode/")
    }
}