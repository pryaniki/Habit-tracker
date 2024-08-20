'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';
 
/* page */
const page = {
    menu: document.querySelector('.menu__list'),
    header: {
        h1: document.querySelector('.h1'),
        progressPrecent: document.querySelector('.progress__precent'),
        progressCoverBar: document.querySelector('.progress__cover-bar'),
    },
    content: document.querySelector('.list'),
}

/* utils */

function loadData() {
    const habbitString = localStorage.getItem(HABBIT_KEY);
    const habbitArray = JSON.parse(habbitString);
    if (Array.isArray(habbitArray)) {
        habbits = habbitArray;
    }
}

function setData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

function removeComment(habbitId, index) {
    delete localStorage.HABBIT_KEY.habbitId.days.index;
}

/* render */
function rerenderMenu(activeHabbit) {
    if (!activeHabbit) {
        return;
    }

    for (const habbit of habbits) {
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
        // console.log(existed);
        if (!existed) {
            // создание
            const element = document.createElement('button');
            element.setAttribute('menu-habbit-id', habbit.id);
            element.classList.add('menu__item');
            element.addEventListener('click', () => rerander(habbit.id));
            element.innerHTML = `<img src="images/icons/${habbit.icon}.svg" alt="${habbit.name}">`;
            if (activeHabbit.id === habbit.id) {
                element.classList.add('menu__item_active');
            }
            page.menu.appendChild(element);
            continue;
        }
        if (activeHabbit.id === habbit.id) {
            existed.classList.add('menu__item_active');
        } else {
            existed.classList.remove('menu__item_active');
        }
    }

}

function reranderHead(activeHabbit) {
    if (!activeHabbit) {
        return;
    }
    page.header.h1.innerText = activeHabbit.name;
    const progress = activeHabbit.days.length / activeHabbit.target > 1
    ? 100
    : activeHabbit.days.length / activeHabbit.target * 100;
    
    page.header.progressCoverBar.style.width = `${progress.toFixed(0)}%`; // округлить до целого
    page.header.progressPrecent.innerText = `${progress} %`;
}

function reranderContent(activeHabbit) {
    if (!activeHabbit) {
        return;
    }
    page.content.innerHTML = '';

    for (const [i, data] of activeHabbit.days.entries()) {
        const currentDay = i + 1;
        console.log(`День ${i+1}: ${data.comment}`);
        const element = document.createElement('div');
        element.classList.add('habbit');
        element.setAttribute('day-number', currentDay);
        element.innerHTML = `<div class="habbit__day">День ${currentDay}</div>
        <div class="habbit__comment">${data.comment}</div>`;

        const deliteButton = document.createElement('button');
        deliteButton.classList.add('habbit__delete');
        deliteButton.innerHTML = `<img src="images/icons/delete.svg" alt="Удалить День ${currentDay}">`;
        // deliteButton.addEventListener('click', () => 
        //     removeComment(activeHabbit.id, i)
        // );

        element.appendChild(deliteButton);

        page.content.appendChild(element);
    }

}

function rerander(activeHabbitId) {
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    rerenderMenu(activeHabbit);
    reranderHead(activeHabbit);
    reranderContent(activeHabbit);
 
}

/* init */
(() => {
    loadData();
    rerander(habbits[0].id)
})();