'use strict';

function submitForm() {
    const input = document.querySelector('.input').value;
    if (!input) {
        return false;
    }
    document.querySelector('.panel').innerText = input;
    document.querySelector('.input').value = '';
    // document.querySelector('.notification').style.display = 'block';
    // document.querySelector('.notification').classList.add('notification_active');
    document.querySelector('.notification').classList.remove('notification_hidden');
     
   console.log(document.querySelector('.notification').getAttribute('class'));
   document.querySelector('.notification').setAttribute('key', 1);
}

function inputChange(e) {
    if (e.code === 'Enter' ) {
        submitForm();
    }
}

localStorage.setItem('token', 'fawsd');
localStorage.setItem('token2', false);
const token = localStorage.getItem('token');
const token2 = localStorage.getItem('token2');

console.log(token);
console.log(typeof token); // string

console.log(token2);
console.log(typeof token2); // string
localStorage.removeItem('token2');
localStorage.clear();
// console.log();
// console.log();
