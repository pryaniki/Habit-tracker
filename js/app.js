'use strict';

let habits = [];
const HABIT_KEY = 'HABIT_KEY';
let globalActiveHabitId;
 
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
        nextDay: document.querySelector('.habit__day'),
    },
    popup: {
        index: document.getElementById('add-habit-popup'),
        iconField: document.querySelector('.popup__form input[name="icon"]')
    }
    
}


/* utils */

function loadData() {
    const habitString = localStorage.getItem(HABIT_KEY);
    const habitArray = JSON.parse(habitString);
    if (Array.isArray(habitArray)) {
        habits = habitArray;
    }
}

function saveData() {
    localStorage.setItem(HABIT_KEY, JSON.stringify(habits));
}

function removeDay(index) {
    // let habits = localStorage.getItem(HABIT_KEY);

    habits = habits.map(habit => {
        if (habit.id === globalActiveHabitId) {
            habit.days.splice(index, 1); 
            return {
                ...habit,
                days: habit.days
            }
        }
        return habit;
    });
    rerander(globalActiveHabitId);
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

function resetForm(form, fields) {
    for (const field of fields) {
        form[field].value = '';
    }
}

function validateAndGetFormData(form, fields) {
    const formData = new FormData(form); // передаем форму
    const res = {};

    for (const field of fields) {
        const fieldValue = formData.get(field);
        form[field].classList.remove('error');
        if (!fieldValue) {
            form[field].classList.add('error');
        }
        res[field] = fieldValue;
    }
    
    let isValid = true;
    for (const field of fields) {
        if (!res[field]) {
            return;
        }
    }

    return res;
}

/* render */
function rerenderMenu(activeHabit) {
    for (const habit of habits) {
        const existed = document.querySelector(`[menu-habit-id="${habit.id}"]`);
        if (!existed) {
            // создание
            const element = document.createElement('button');
            element.setAttribute('menu-habit-id', habit.id);
            element.classList.add('menu__item');
            element.addEventListener('click', () => rerander(habit.id));
            element.innerHTML = `<img src="images/icons/${habit.icon}.svg" alt="${habit.name}">`;
            if (activeHabit.id === habit.id) {
                element.classList.add('menu__item_active');
            }
            page.menu.appendChild(element);
            continue;
        }
        if (activeHabit.id === habit.id) {
            existed.classList.add('menu__item_active');
        } else {
            existed.classList.remove('menu__item_active');
        }
    }

}

function reranderHead(activeHabit) {
    page.header.h1.innerText = activeHabit.name;
    const progress = activeHabit.days.length / activeHabit.target > 1
    ? 100
    : activeHabit.days.length / activeHabit.target * 100;
    
    page.header.progressCoverBar.style.width = `${progress.toFixed(0)}%`; // округлить до целого
    page.header.progressPrecent.innerText = `${progress.toFixed(0)} %`;
}

function reranderContent(activeHabit) {
    globalActiveHabitId = activeHabit.id;

    page.content.daysContainer.innerHTML = '';

    for (const [i, data] of activeHabit.days.entries()) {
        const currentDay = i + 1;
        const element = document.createElement('div');
        element.classList.add('habit');
        element.innerHTML = `<div class="habit__day">День ${currentDay}</div>
        <div class="habit__comment">${data.comment}</div>
        <button class="habit__delete" onclick="removeDay(${i})">
            <img src="images/icons/delete.svg" alt="Удалить День ${currentDay}">
        </button>`;

        page.content.daysContainer.appendChild(element);
    }

    page.content.nextDay.innerText = `День ${activeHabit.days.length + 1}`;

}

function rerander(globalActiveHabitId) {
    const activeHabit = habits.find(habit => habit.id === globalActiveHabitId);

    if (!activeHabit) {
        return;
    }
    document.location.replace(document.location.pathname + '#' + globalActiveHabitId)
    rerenderMenu(activeHabit);
    reranderHead(activeHabit);
    reranderContent(activeHabit);
 
}
/* work with days*/
function addDay(event) {
    event.preventDefault(); // уберет дефолтное поведение формы.Т.е. отправку данных
    const form = event.target;
    const fields = ['comment'];
    const data = validateAndGetFormData(form, fields);

    if (!data) {
        return;
    }

    habits = habits.map(habit => {
        if (habit.id === globalActiveHabitId) {
            return {
                ...habit,
                days: habit.days.concat({ comment: data.comment })
            }
        }
        return habit;
    });

    resetForm(form, fields);
    rerander(globalActiveHabitId);
    saveData();
  
}

/* working with habits */
function addHabit(event) {
    event.preventDefault(); // уберет дефолтное поведение формы.Т.е. отправку данных

    const form = event.target;
    const fields = ['name', 'icon', 'target'];
    
    const data = validateAndGetFormData(form, fields);
    if (!data) {
        return;
    }
    


    const maxId = habits.reduce((acc, habit) => acc > habit.id ? acc : habit.id, 0);
    const habitId = maxId + 1;

    const habit = {
        id: habitId,
        icon: data.icon,
        name: data.name,
        target: data.target,
        days: []
    };

    habits.push(habit);


    globalActiveHabitId = habitId;
    
    resetForm(form, ['name', 'target']);
    togglePopup();
    rerander(globalActiveHabitId);
    saveData();
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
    const hashId = Number(document.location.hash.replace('#', ''));
    const urlHabit = habits.find(habit => habit.id == hashId);

    if (!urlHabit){
        rerander(habits[0].id);
    } else {
        rerander(urlHabit.id);
    }
})();

