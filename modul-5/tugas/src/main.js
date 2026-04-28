import './style.css'

const btn = document.getElementById("toggleDark")
const html = document.documentElement

if (btn) {
  btn.addEventListener("click", () => {
    html.classList.toggle("dark")
    localStorage.setItem("theme",
      html.classList.contains("dark") ? "dark" : "light")
  })
}