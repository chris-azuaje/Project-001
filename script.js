const payments = [
  {
    date: "04/14/2025",
    price: 100,
    description: "Shoes from Target.",
    category: "clothes",
    id: 123456789,
  },
];

if (!window.__boxHandlersAttached) {
  window.__boxHandlersAttached = true;

  document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.querySelector(".add");
    const removeBtn = document.querySelector(".remove");
    const main = document.querySelector("main");

    function createBox() {
      const div = document.createElement("div");
      div.className = "expense_container";
      const p0 = document.createElement("p");
      p0.textContent = "04/14/1997";
      const p1 = document.createElement("p");
      p1.textContent = "$100";
      const p2 = document.createElement("p");
      p2.textContent = "Description: Shoes from Target";
      const p3 = document.createElement("p");
      p3.textContent = "Category: Clothes";
      const p4 = document.createElement("p");
      p4.textContent = "ID: 123456789";
      div.appendChild(p0);
      div.appendChild(p1);
      div.appendChild(p2);
      div.appendChild(p3);
      div.appendChild(p4);
      return div;
    }

    addBtn.addEventListener("click", () => {
      const containers = main.querySelectorAll(".expense_container");
      const newContainer = createBox();
      if (containers.length) {
        containers[containers.length - 1].after(newContainer);
      } else {
        // No containers found — insert before the buttons if they exist inside the main,
        // otherwise append to the main as a safe fallback.
        const btns = main.querySelector(".btns_div");
        if (btns) main.insertBefore(newContainer, btns);
        else main.appendChild(newContainer);
      }
    });

    removeBtn.addEventListener("click", () => {
      const containers = main.querySelectorAll(".expense_container");
      // Keep at least one box — do nothing if only one left
      if (containers.length < 1) return;
      const last = containers[containers.length - 1];
      last.remove();
    });
  });
}

function toggleOverlay(isVisible) {
  const overlay = document.getElementById("pageOverlay");
  if (!overlay) return;
  overlay.classList.toggle("active", isVisible);
  overlay.setAttribute("aria-hidden", String(!isVisible));
}

function openForm() {
  document.getElementById("myForm").style.display = "block";
  const form = document.getElementById("myForm");
  if (!form) return;
  form.style.display = "block";
  toggleOverlay(true);
}
function closeForm() {
  document.getElementById("myForm").style.display = "none";
  const form = document.getElementById("myForm");
  if (!form) return;
  form.style.display = "none";
  toggleOverlay(false);
}
