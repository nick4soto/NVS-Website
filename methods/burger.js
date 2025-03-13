document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const navBar = document.querySelector('.navBar');
    const dropdowns = document.querySelectorAll('.dropdown');
    const plusIcons = document.querySelectorAll('.plus-icon');

    burger.addEventListener('click', () => {
        navBar.classList.toggle('active');
        burger.classList.toggle('active');
    });

    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const plusIcon = dropdown.querySelector('.plus-icon');
        dropbtn.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.classList.toggle('active');
            plusIcon.textContent = dropdown.classList.contains('active') ? '-' : '+';
        });
    });
});
