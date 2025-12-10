// --------- Navegação entre seções ---------

const buttonsMenu = document.querySelectorAll(".menu-btn[data-section]");
const sections = document.querySelectorAll(".section");

buttonsMenu.forEach((btn) => {
  btn.addEventListener("click", () => {
    const sectionId = btn.getAttribute("data-section");
    if (!sectionId) return;

    sections.forEach((sec) => sec.classList.remove("active"));

    const alvo = document.getElementById(sectionId);
    if (alvo) {
      alvo.classList.add("active");
    }
  });
});

// --------- Modal de login/cadastro ---------

const btnLogin = document.getElementById("btn-login");
const modalAuth = document.getElementById("modal-auth");
const btnCloseModal = document.getElementById("close-modal");

btnLogin.addEventListener("click", () => {
  modalAuth.classList.add("show");
});

btnCloseModal.addEventListener("click", () => {
  modalAuth.classList.remove("show");
});

modalAuth.addEventListener("click", (event) => {
  if (event.target === modalAuth) {
    modalAuth.classList.remove("show");
  }
});

// Tabs login/cadastro
const tabsAuth = document.querySelectorAll(".tab-auth");
const formsAuth = document.querySelectorAll(".form-auth");

tabsAuth.forEach((tab) => {
  tab.addEventListener("click", () => {
    const alvo = tab.getAttribute("data-tab");

    tabsAuth.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    formsAuth.forEach((form) => form.classList.remove("active"));

    if (alvo === "login") {
      document.getElementById("form-login").classList.add("active");
    } else if (alvo === "cadastro") {
      document.getElementById("form-cadastro").classList.add("active");
    }
  });
});

// Impede reload na submissão (por enquanto só alerta)
formsAuth.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Aqui futuramente vamos conectar com o backend 😎");
  });
});

// --------- Montador de Decks ---------

const cardOptions = document.querySelectorAll(".card-option");
const deckSlots = document.querySelectorAll(".deck-slot");
const deckCountSpan = document.getElementById("deck-count");
const avgElixirSpan = document.getElementById("avg-elixir");

// Inputs de busca e filtros
const searchInput = document.getElementById("search-card");
const filterType = document.getElementById("filter-type");
const filterRarity = document.getElementById("filter-rarity");
const filterElixir = document.getElementById("filter-elixir");

// Inicialmente, marcamos todos os slots como vazios
deckSlots.forEach((slot) => {
  slot.dataset.name = "";
  slot.dataset.elixir = "";
});

// Atualiza quantidade de cartas e custo médio
function atualizarInfoDeck() {
  let totalElixir = 0;
  let count = 0;

  deckSlots.forEach((slot) => {
    const elixir = parseFloat(slot.dataset.elixir);
    if (!isNaN(elixir) && elixir > 0) {
      totalElixir += elixir;
      count++;
    }
  });

  deckCountSpan.textContent = `${count}/8`;
  avgElixirSpan.textContent =
    count > 0 ? (totalElixir / count).toFixed(1) : "0.0";
}

// Adicionar carta no primeiro slot vazio
function adicionarCartaAoDeck(cardElement) {
  const name = cardElement.dataset.name;
  const elixir = cardElement.dataset.elixir;

  const slotVazio = Array.from(deckSlots).find(
    (slot) => !slot.dataset.name || slot.dataset.name === ""
  );

  if (!slotVazio) {
    alert("Seu deck já está com 8 cartas!");
    return;
  }

  slotVazio.dataset.name = name;
  slotVazio.dataset.elixir = elixir;
  slotVazio.textContent = `${name} (${elixir}⚡)`;
  slotVazio.classList.add("filled");

  atualizarInfoDeck();
}

// Clique nas cartas para adicionar
cardOptions.forEach((card) => {
  card.addEventListener("click", () => {
    adicionarCartaAoDeck(card);
  });
});

// Clique no slot para remover carta
deckSlots.forEach((slot) => {
  slot.addEventListener("click", () => {
    if (!slot.dataset.name) return;

    slot.dataset.name = "";
    slot.dataset.elixir = "";
    slot.textContent = "Vazio";
    slot.classList.remove("filled");

    atualizarInfoDeck();
  });
});

// Atualiza info no início
atualizarInfoDeck();

// --------- Filtro de cartas ---------

function filtrarCartas() {
  const termo = searchInput.value.toLowerCase().trim();
  const tipoSelecionado = filterType.value;
  const raridadeSelecionada = filterRarity.value;
  const elixirSelecionado = filterElixir.value;

  cardOptions.forEach((card) => {
    const name = card.dataset.name.toLowerCase();
    const tipo = card.dataset.type;
    const raridade = card.dataset.rarity;
    const elixir = parseInt(card.dataset.elixir, 10);

    let mostra = true;

    // Filtro por nome
    if (termo && !name.includes(termo)) {
      mostra = false;
    }

    // Filtro por tipo
    if (tipoSelecionado !== "todos" && tipo !== tipoSelecionado) {
      mostra = false;
    }

    // Filtro por raridade
    if (raridadeSelecionada !== "todas" && raridade !== raridadeSelecionada) {
      mostra = false;
    }

    // Filtro por elixir (faixa)
    if (elixirSelecionado !== "todos") {
      if (elixirSelecionado === "2-3" && !(elixir >= 2 && elixir <= 3)) {
        mostra = false;
      } else if (elixirSelecionado === "4-5" && !(elixir >= 4 && elixir <= 5)) {
        mostra = false;
      } else if (elixirSelecionado === "6+" && elixir < 6) {
        mostra = false;
      }
    }

    card.style.display = mostra ? "flex" : "none";
  });
}

if (searchInput && filterType && filterRarity && filterElixir) {
  searchInput.addEventListener("input", filtrarCartas);
  filterType.addEventListener("change", filtrarCartas);
  filterRarity.addEventListener("change", filtrarCartas);
  filterElixir.addEventListener("change", filtrarCartas);
}