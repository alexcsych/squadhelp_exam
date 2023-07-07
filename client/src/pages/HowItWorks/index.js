let navbarItems = document.getElementsByClassName('navbar-nav-item');

Array.from(navbarItems).forEach(function (navbarItem) {
  let icon = navbarItem.querySelector('i');

  navbarItem.addEventListener('mouseover', function () {
    icon.style.color = 'blue';
    icon.classList.remove('fa-angle-down');
    icon.classList.add('fa-angle-up');
  });

  navbarItem.addEventListener('mouseout', function () {
    icon.style.color = '#4a4a4a';
    icon.classList.remove('fa-angle-up');
    icon.classList.add('fa-angle-down');
  });
});
