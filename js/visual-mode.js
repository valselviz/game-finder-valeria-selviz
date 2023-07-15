export function refreshVisualMode() {
    const visualMode = localStorage.getItem("visualMode")
    let oldImagePath;
    let newImagePath;
    if (visualMode == "dark"){
        document.body.className = "darkMode"
        oldImagePath = "assets/light-mode/"
        newImagePath = "assets/dark-mode/"
    } else {
        document.body.className = "lightMode"
        oldImagePath = "assets/dark-mode/"
        newImagePath = "assets/light-mode/"
    }

    // Since the images src is defined in HTML instead of CSS, they need to be manually updated 
    const allImages = document.body.querySelectorAll('img')
    for (const img of allImages) {
        img.src = img.src.replaceAll(oldImagePath, newImagePath)
    }
}