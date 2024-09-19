'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';
let globalActiveHabbitId;
 
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
    },
    popup: {
        index: document.getElementById('add-habbit-popup'),
        iconField: document.querySelector('.popup__form input[name="icon"]'),
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

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

function removeDay(index) {
    // let habbits = localStorage.getItem(HABBIT_KEY);

    habbits = habbits.map(habbit => {
        if (habbit.id === globalActiveHabbitId) {
            console.log(habbit);
            habbit.days.splice(index, 1); 
            console.log(habbit);
            return {
                ...habbit,
                days: habbit.days
            }
        }
        return habbit;
    });
    rerander(globalActiveHabbitId);
    saveData();
}

function togglePopup() {
    const popup = page.popup.index;
    const className = 'cover_hidden';
    if (popup.classList.contains(className)) {
        popup.classList.remove(className);
    } else {
        popup.classList.add(className);
    }
}

// function validateForm(form, fields) {
//     const formData = new FormData(form); // передаем форму
    
//     const nameInput = form.querySelector('[name="name"]');
//     const iconInput = form.querySelector('[name="icon"]');
//     const targetInput = form.querySelector('[name="target"]');

//     const name = nameInput.value;
//     const icon = iconInput.value;
//     const target = targetInput.value;

//     form['name'].classList.remove('error');
//     form['target'].classList.remove('error');

//     if (!name) {
//         nameInput.classList.add('error');
//         form['name'].classList.add('error');
//     } 
//     if (!target) {
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
    globalActiveHabbitId = activeHabbit.id;

    page.content.daysContainer.innerHTML = '';

    for (const [i, data] of activeHabbit.days.entries()) {
        const currentDay = i + 1;
        const element = document.createElement('div');
        element.classList.add('habbit');
        element.innerHTML = `<div class="habbit__day">День ${currentDay}</div>
        <div class="habbit__comment">${data.comment}</div>
        <button class="habbit__delete" onclick="removeDay(${i})">
            <img src="images/icons/delete.svg" alt="Удалить День ${currentDay}">
        </button>`;

        page.content.daysContainer.appendChild(element);
    }

    page.content.nextDay.innerText = `День ${activeHabbit.days.length + 1}`;

}

function rerander(globalActiveHabbitId) {
    const activeHabbit = habbits.find(habbit => habbit.id === globalActiveHabbitId);

    if (!activeHabbit) {
        return;
    }

    rerenderMenu(activeHabbit);
    reranderHead(activeHabbit);
    reranderContent(activeHabbit);
 
}
/* work with days*/
function addDay(event) {
    const form = event.target;
    event.preventDefault(); // уберет дефолтное поведение формы.Т.е. отправку данных

    const data = new FormData(form); // передаем форму
    const comment = data.get("comment");
    
    const input = document.querySelector('[name="comment"]');

    form['comment'].classList.remove('error');

    if (!comment) {
        console.log(form);
        console.log(input);
        input.classList.add('error');
        form['comment'].classList.add('error');
    } else {
        habbits = habbits.map(habbit => {
            if (habbit.id === globalActiveHabbitId) {
                return {
                    ...habbit,
                    days: habbit.days.concat({ comment })
                }
            }
            return habbit;
        });
    
        form['comment']['value'] = '';
        rerander(globalActiveHabbitId);
        saveData();
    }
  
}

/* working with habbits */
function addHabbit(event) {
    const form = event.target;
    event.preventDefault(); // уберет дефолтное поведение формы.Т.е. отправку данных
  
    const data = new FormData(form); // передаем форму
    
    const nameInput = form.querySelector('[name="name"]');
    const iconInput = form.querySelector('[name="icon"]');
    const targetInput = form.querySelector('[name="target"]');

    const name = nameInput.value;
    const icon = iconInput.value;
    const target = targetInput.value;

    form['name'].classList.remove('error');
    form['target'].classList.remove('error');

    if (!name) {
        nameInput.classList.add('error');
        form['name'].classList.add('error');
    } 
    if (!target) {
        targetInput.classList.add('error');
        form['target'].classList.add('error');
    }
    
    if (name && target) {
        console.log(habbits);

        const habbit = {
            id: habbits.length+1,
            icon,
            name,
            target,
            days: []
        };
        console.log(habbit);
        habbits.push(habbit);
        console.log(habbits);

        // habbits = habbits.map(habbit => {
        //     if (habbit.id === globalActiveHabbitId) {
        //         return {
        //             ...habbit,
        //             days: habbit.days.concat({ comment })
        //         }
        //     }
        //     return habbit;
        // });
    
        nameInput.value = '';
        // iconInput.value = '';
        targetInput.value = '';
        globalActiveHabbitId = habbits.length;
        rerander(globalActiveHabbitId);
        saveData();
    }
}

function setIcon(context, icon){
    const activeIcon = document.querySelector('.icon.icon_active');
    activeIcon.classList.remove('icon_active');
     
    context.classList.add('icon_active');
    page.popup.iconField.value = icon;
}

/* init */
(() => {
    loadData();
    rerander(habbits[0].id);
})();

