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
    const form = document.querySelector(".form-container");
    const messageEl = form?.querySelector(".form-message");

    const defaultExpenseTemplate = {
      date: "04/14/1997",
      price: 100,
      description: "Shoes from Target",
      category: "Clothes",
    };

    function formatCurrency(amount) {
      const numericValue = Number(amount);
      if (Number.isFinite(numericValue)) {
        return `$${numericValue.toFixed(2)}`;
      }
      return `$${amount}`;
    }

    function formatCategory(category) {
      if (!category) return "";
      return category.charAt(0).toUpperCase() + category.slice(1);
    }

    function formatDate(dateString) {
      const parts = dateString.split("-");
      if (parts.length !== 3) return dateString;
      const [year, month, day] = parts;
      return `${month}/${day}/${year}`;
    }

    function generateExpenseId() {
      return `EXP-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 6)}`.toUpperCase();
    }

    function createExpenseElement({ date, price, description, category, id }) {
      const div = document.createElement("div");
      div.className = "expense_container";

      const dateEl = document.createElement("p");
      dateEl.textContent = date;

      const priceEl = document.createElement("p");
      priceEl.textContent = formatCurrency(price);

      const descriptionEl = document.createElement("p");
      descriptionEl.textContent = `Description: ${description}`;

      const categoryEl = document.createElement("p");
      categoryEl.textContent = `Category: ${formatCategory(category)}`;

      const idEl = document.createElement("p");
      idEl.textContent = `ID: ${id}`;

      div.append(dateEl, priceEl, descriptionEl, categoryEl, idEl);
      return div;
    }

    function sanitizeExpense(expense) {
      if (!expense) return null;

      const trimmedDate = String(expense.date ?? "").trim();
      const trimmedDescription = String(expense.description ?? "").trim();
      const trimmedCategory = String(expense.category ?? "").trim();
      const trimmedId = String(expense.id ?? "").trim();

      const numericPrice =
        typeof expense.price === "number"
          ? expense.price
          : Number(String(expense.price ?? "").trim());

      if (
        !trimmedDate ||
        !trimmedDescription ||
        !trimmedCategory ||
        !trimmedId ||
        !Number.isFinite(numericPrice)
      ) {
        return null;
      }

      return {
        date: trimmedDate,
        price: numericPrice,
        description: trimmedDescription,
        category: trimmedCategory,
        id: trimmedId,
      };
    }

    function removeEmptyExpenseContainers() {
      if (!main) return;
      const containers = main.querySelectorAll(".expense_container");
      containers.forEach((container) => {
        if (container.textContent.trim() === "") {
          container.remove();
        }
      });
    }

    function insertExpenseElement(element) {
      if (!main || !element) return;
      const containers = main.querySelectorAll(".expense_container");

      if (containers.length) {
        containers[containers.length - 1].after(element);
      } else {
        const btns = main.querySelector(".btns_div");
        if (btns) main.insertBefore(element, btns);
        else main.appendChild(element);
      }
    }

    function appendExpense(expense) {
      const sanitized = sanitizeExpense(expense);
      if (!sanitized) return null;

      const newElement = createExpenseElement(sanitized);
      insertExpenseElement(newElement);
      payments.push(sanitized);
      removeEmptyExpenseContainers();
      return sanitized;
    }

    function setFormMessage(message, isError = true) {
      if (!messageEl) return;
      messageEl.textContent = message;
      messageEl.classList.toggle("success", !isError && Boolean(message));
    }

    if (addBtn) {
      addBtn.addEventListener("click", () => {
        appendExpense({
          ...defaultExpenseTemplate,
          id: generateExpenseId(),
        });
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        if (!main) return;
        const containers = main.querySelectorAll(".expense_container");
        if (containers.length < 1) return;
        const last = containers[containers.length - 1];
        last.remove();
      });
    }

    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const dateInput = form.querySelector("#date");
        const costInput = form.querySelector("#cost");
        const descriptionInput = form.querySelector("#description");
        const categoryInput = form.querySelector("#category");

        const dateValue = dateInput?.value.trim() ?? "";
        const costValue = costInput?.value.trim() ?? "";
        const descriptionValue = descriptionInput?.value.trim() ?? "";
        const categoryValue = categoryInput?.value.trim() ?? "";

        if (!dateValue || !costValue || !descriptionValue || !categoryValue) {
          setFormMessage("Please complete all fields before submitting.");
          return;
        }

        const parsedPrice = Number(costValue);
        if (!Number.isFinite(parsedPrice)) {
          setFormMessage("Purchase amount must be a valid number.");
          return;
        }

        const appended = appendExpense({
          date: formatDate(dateValue),
          price: parsedPrice,
          description: descriptionValue,
          category: categoryValue,
          id: generateExpenseId(),
        });

        if (!appended) {
          setFormMessage(
            "Unable to create the expense entry. Please try again."
          );
          return;
        }

        setFormMessage("");
        form.reset();
        closeForm();
      });
    }
  });
}

function toggleOverlay(isVisible) {
  const overlay = document.getElementById("pageOverlay");
  if (!overlay) return;
  overlay.classList.toggle("active", isVisible);
  overlay.setAttribute("aria-hidden", String(!isVisible));
}

function openForm() {
  const popup = document.getElementById("myForm");
  if (!popup) return;
  popup.style.display = "block";
  const message = popup.querySelector(".form-message");
  if (message) {
    message.textContent = "";
    message.classList.remove("success");
  }
  toggleOverlay(true);
}

function closeForm() {
  const popup = document.getElementById("myForm");
  if (!popup) return;
  popup.style.display = "none";
  toggleOverlay(false);
}
