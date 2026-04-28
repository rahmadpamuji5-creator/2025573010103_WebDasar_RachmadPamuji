import './style.css'

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleDark");
  const html = document.documentElement;

  if (!toggle) return;

  if (localStorage.getItem("theme") === "dark") {
    html.classList.add("dark");
  }

  toggle.addEventListener("click", () => {
    html.classList.toggle("dark");

    if (html.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
});