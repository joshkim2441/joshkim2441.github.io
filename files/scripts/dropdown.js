/* ________________Passengers */
document.querySelectorAll('#pass-dropdown-content a').forEach(function (element) {
    element.addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('selected-pass').textContent = 'Selected Number of Passengers: ';
        document.getElementById('selected-pass').textContent = this.textContent;
    });
});

/* ________________Pickup */
document.querySelectorAll('#pickup-dropdown-content a').forEach(function (element) {
    element.addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('selected-pickup').textContent = 'Selected Pick-up Point: ';
        document.getElementById('selected-pickup').textContent = this.textContent;
    });
});

/* _______________Destinations */
document.querySelectorAll('#dest-dropdown-content a').forEach(function (element) {
    element.addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('selected-destination').textContent = 'Selected Destination: ';
        document.getElementById('selected-destination').textContent = this.textContent;
    });
});

/** Accordion */
function Accordion(el, multiple) {
    this.el = el || {};
    this.multiple = multiple || false;

    const links = this.el.querySelectorAll('.link');
    links.forEach(link => link.addEventListener('click', this.dropdown.bind(this)));
}

Accordion.prototype.dropdown = function (event) {
    const $this = event.currentTarget;
    const $next = $this.nextElementSibling;

    $next.classList.toggle('open');
    $next.style.display = $next.style.display === 'none' ? 'block' : 'none';

    if (!this.multiple) {
        const allSubmenus = this.el.querySelectorAll('.submenu');
        allSubmenus.forEach(submenu => {
            if (submenu !== $next) {
                submenu.style.display = 'none';
                submenu.parentNode.classList.remove('open');
            }
        });
    }
};
const accordion = new Accordion(document.getElementById('accordion'), false);
