// Menu mobile
const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
if (btn && nav) {
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
}

// YouTube "lite": só carrega o player quando o visitante clica
document.querySelectorAll('.lite-yt[data-id]').forEach((box) => {
  const id = box.dataset.id;
  if (!id) return;
  const thumb = box.querySelector('button');
  thumb.style.background = `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url(https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg) center/cover`;
  thumb.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
    f.title = box.dataset.title || 'Vídeo do canal Contas na Mesa';
    f.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
    f.allowFullscreen = true;
    box.replaceChildren(f);
  });
});
