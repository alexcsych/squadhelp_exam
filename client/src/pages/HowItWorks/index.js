'use strict';

let navbarNavIconMenu = document.querySelector('.navbar-nav-icon-menu');
let navbarBot = document.querySelector('.navbar-bot');

navbarNavIconMenu.addEventListener('click', function () {
  navbarBot.style.display === 'block'
    ? (navbarBot.style.display = 'none')
    : (navbarBot.style.display = 'block');
});
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

const buttons = document.querySelectorAll('.card-btn');

buttons.forEach(function (button) {
  const arrow = button.querySelector('i.arrow');
  const content = button.closest('.cards').querySelector('.cards-content');

  button.addEventListener('click', function () {
    const activeButton = button
      .closest('.section-d-pb-article')
      .querySelector('.card-btn.active');
    const activeContent = button
      .closest('.section-d-pb-article')
      .querySelector('.cards-content.active');

    if (activeButton && activeButton !== button) {
      activeButton.classList.remove('active');
      activeButton.querySelector('i.arrow').classList.remove('fa-arrow-down');
      activeButton.querySelector('i.arrow').classList.add('fa-arrow-right');
      activeContent.classList.remove('active');
    }

    if (!button.classList.contains('active')) {
      arrow.classList.remove('fa-arrow-right');
      arrow.classList.add('fa-arrow-down');
      content.classList.add('active');
      button.classList.add('active');
    } else {
      arrow.classList.remove('fa-arrow-down');
      arrow.classList.add('fa-arrow-right');
      content.classList.remove('active');
      button.classList.remove('active');
    }
  });
});
