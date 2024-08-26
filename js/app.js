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
    content: {
        daysContainer: document.getElementById('days'),
        nextDay: document.querySelector('.habbit__day'),
    }
    
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

// function removeComment(habbitId, index) {
//     delete localStorage.HABBIT_KEY.habbitId.days.index;
// }

/* render */
function rerenderMenu(activeHabbit) {
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
    page.header.h1.innerText = activeHabbit.name;
    const progress = activeHabbit.days.length / activeHabbit.target > 1
    ? 100
    : activeHabbit.days.length / activeHabbit.target * 100;
    
    page.header.progressCoverBar.style.width = `${progress.toFixed(0)}%`; // округлить до целого
    page.header.progressPrecent.innerText = `${progress} %`;
}

function reranderContent(activeHabbit) {
    page.content.daysContainer.innerHTML = '';

    for (const [i, data] of activeHabbit.days.entries()) {
        const currentDay = i + 1;
        const element = document.createElement('div');
        element.classList.add('habbit');
        element.innerHTML = `<div class="habbit__day">День ${currentDay}</div>
        <div class="habbit__comment">${data.comment}</div>
        <button class="habbit__delete">
            <img src="images/icons/delete.svg" alt="Удалить День ${currentDay}">
        </button>`;

        page.content.daysContainer.appendChild(element);
    }

    page.content.nextDay.innerText = `День ${activeHabbit.days.length + 1}`;

}

function rerander(activeHabbitId) {
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);

    if (!activeHabbit) {
        return;
    }

    rerenderMenu(activeHabbit);
    reranderHead(activeHabbit);
    reranderContent(activeHabbit);
 
}
/* work with days*/
function addDay(event) {
    event.preventDefault(); // уберет дефолтное поведение формы.Т.е. отправку данных
    console.log(event);

    const data = new FormData(event.target); // передаем форму
    let comment = data.get("comment");
    console.log(comment);


}

/* init */
(() => {
    loadData();
    rerander(habbits[0].id)
})();