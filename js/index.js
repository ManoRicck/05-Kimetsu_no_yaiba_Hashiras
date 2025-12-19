const botoes = document.querySelectorAll(".botao");
const personagens = document.querySelectorAll(".personagem");

/* --- Controle de Auto Scroll --- */
let autoScrollActive = false;
let animationId;
let currentPos = 0;
let startTimeout;
let scrollSpeed = 0.4;

const interactionEvents = ['mousedown', 'wheel', 'touchmove', 'keydown', 'click'];

function startScrollLoop() {
    if (!autoScrollActive) return;

    const totalHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    // Se chegou no fim, para
    if ((window.scrollY + windowHeight) >= totalHeight - 1) {
        autoScrollActive = false;
        return;
    }

    currentPos += scrollSpeed;
    window.scrollTo(0, currentPos);
    animationId = requestAnimationFrame(startScrollLoop);
}

function stopAutoScroll() {
    autoScrollActive = false;
    cancelAnimationFrame(animationId);
    clearTimeout(startTimeout);
}

// Manipulador de eventos para parar o scroll (interação do usuário)
function userInteractionHandler(e) {
    // Se a interação foi nos botões de navegação, não para o scroll (pois eles reiniciam)
    if (e.target.closest('.botoes')) return;

    stopAutoScroll();
    removeStopListeners(); // Remove listeners para não ficarem rodando à toa
}

function addStopListeners() {
    interactionEvents.forEach(event => {
        document.addEventListener(event, userInteractionHandler, { passive: true });
    });
}

function removeStopListeners() {
    interactionEvents.forEach(event => {
        document.removeEventListener(event, userInteractionHandler);
    });
}

function resetAndStartAutoScroll() {
    // 1. Para tudo anterior
    stopAutoScroll();
    
    // 2. Volta ao topo suavemente
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 3. Reativa flag
    autoScrollActive = true;
    
    // 4. Garante que listeners de parada estejam ativos (remove antes pra não duplicar)
    removeStopListeners();
    addStopListeners();

    // 5. Aguarda o scroll suave subir (1.2s) antes de começar a descer
    startTimeout = setTimeout(() => {
        if (autoScrollActive) { // Checa se usuário não parou nesse meio tempo
            currentPos = window.scrollY; // Sincroniza posição
            startScrollLoop();
        }
    }, 1200);
}

/* --- Lógica dos Botões --- */
botoes.forEach((botao, indice) => {
    botao.addEventListener("click", () => {
        // Troca visual dos botões
        const botaoSelecionado = document.querySelector(".botao.selecionado");
        if (botaoSelecionado) {
            botaoSelecionado.classList.remove("selecionado");
        }
        botao.classList.add("selecionado");

        // Troca visual dos personagens
        const personagemSelecionado = document.querySelector(".personagem.selecionado");
        if (personagemSelecionado) {
            personagemSelecionado.classList.remove("selecionado");
        }
        personagens[indice].classList.add("selecionado");
        
        // Reinicia o scroll automático
        resetAndStartAutoScroll();
    });
});

// Inicia ao carregar a página
resetAndStartAutoScroll();