(function(){
  const header=document.querySelector('header');
  const nav=header?.querySelector('nav');
  const toggle=header?.querySelector('.mobile-menu');
  if(!header||!nav||!toggle)return;
  header.classList.add('site-header-shell');
  toggle.innerHTML='<span></span><span></span><span></span>';
  toggle.setAttribute('aria-expanded','false');
  toggle.setAttribute('aria-controls','primary-navigation');
  nav.id='primary-navigation';

  function syncScroll(){header.classList.toggle('header-scrolled',window.scrollY>10&&!nav.classList.contains('open'))}
  function closeMenu(){nav.classList.remove('open');header.classList.remove('header-menu-open');toggle.setAttribute('aria-expanded','false');document.body.style.overflow='';syncScroll()}
  function toggleMenu(){const open=!nav.classList.contains('open');nav.classList.toggle('open',open);header.classList.toggle('header-menu-open',open);toggle.setAttribute('aria-expanded',String(open));document.body.style.overflow=open?'hidden':'';syncScroll()}

  toggle.removeAttribute('onclick');
  toggle.addEventListener('click',toggleMenu);
  nav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu()});
  window.addEventListener('scroll',syncScroll,{passive:true});
  window.addEventListener('resize',()=>{if(window.innerWidth>=701)closeMenu()});
  syncScroll();
})();
