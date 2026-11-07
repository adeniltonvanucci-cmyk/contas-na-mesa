/* Aviso de cookies (Contas na Mesa). A escolha fica só neste navegador (localStorage) e controla o Google Consent Mode. */
(function () {
  var KEY = 'cnm-consent';
  var caixa = null;

  function ler() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function gravar(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* sem armazenamento: o aviso volta na próxima visita */ } }

  function atualizar(concedido) {
    if (typeof window.gtag !== 'function') return;
    var s = concedido ? 'granted' : 'denied';
    window.gtag('consent', 'update', {
      ad_storage: s, ad_user_data: s, ad_personalization: s, analytics_storage: s
    });
  }

  function fechar() {
    if (caixa && caixa.parentNode) caixa.parentNode.removeChild(caixa);
    caixa = null;
  }

  function escolher(concedido) {
    gravar(concedido ? 'granted' : 'denied');
    atualizar(concedido);
    fechar();
  }

  function mostrar() {
    if (caixa) return;
    caixa = document.createElement('div');
    caixa.className = 'cnm-cookies';
    caixa.setAttribute('role', 'dialog');
    caixa.setAttribute('aria-label', 'Aviso de cookies');
    caixa.innerHTML =
      '<p>Usamos cookies de medição (Google Analytics) para entender como o site é usado e para medir anúncios. ' +
      'Eles só são gravados se você aceitar. Veja a <a href="/privacidade.html">Política de privacidade</a>.</p>' +
      '<div class="cnm-cookies-acoes">' +
      '<button type="button" class="cnm-recusar">Recusar</button>' +
      '<button type="button" class="cnm-aceitar">Aceitar</button>' +
      '</div>';
    document.body.appendChild(caixa);
    caixa.querySelector('.cnm-aceitar').addEventListener('click', function () { escolher(true); });
    caixa.querySelector('.cnm-recusar').addEventListener('click', function () { escolher(false); });
  }

  document.addEventListener('click', function (e) {
    var alvo = e.target && e.target.closest ? e.target.closest('[data-cookies]') : null;
    if (alvo) { e.preventDefault(); mostrar(); }
  });

  if (!ler()) mostrar();
})();
