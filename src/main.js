import './style.css'

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});
async function initApp() {
    loadCharacters();
    checkURL();
}

const charContainer = document.querySelector('.characters_container');
const descrContainer = document.querySelector('.character_description');
const charCardsContainer = document.querySelector('.characters_cards_container');

let charDescrCard = document.createElement('div');
descrContainer.append(charDescrCard);

let allCharacters = [];
let allWeapons = [];


const weaponsContainer = document.querySelector('.weapons_container');
const weaponsCardsContainer = document.querySelector('.weapons_cards_container');
const weaponDescrContainer = document.querySelector('.weapons_description');


let weapDescrCard = document.createElement('div');
weaponDescrContainer.append(weapDescrCard);



// отображение персонажей

async function loadCharacters() {
    try {
        const response = await fetch('https://genshin.jmp.blue/characters');
        const characters = await response.json();
        showCharacters();

        const characterPromises = characters.map(async (name) => {
        try {
            const response = await fetch(`https://genshin.jmp.blue/characters/${name}`);
            const data = await response.json();
            data.name = name;
            return data;
        } catch (err) {
            console.error(err);
            return null;
        }
      });


    allCharacters = await Promise.all(characterPromises);
    renderCharacterCards(allCharacters);
    } catch(err) {
        console.error('Error loading characters:', err);
    }
    
}



function renderCharacterCards(characters){
    charCardsContainer.innerHTML = ''; 
    console.log(characters);
    characters.forEach(character => {
        console.log();
        createCharacterCard(character);
    });

}


function showCharacters(){
    charContainer.style.display = 'block';
    descrContainer.style.display = 'none';
    weaponsContainer.style.display = 'none';
    weaponDescrContainer.style.display = 'none';
}

function showCharacterDescr(){
    charContainer.style.display = 'none';
    descrContainer.style.display = 'block';
    weaponsContainer.style.display = 'none';
    weaponDescrContainer.style.display = 'none';
}

function showWeapons(){
    charContainer.style.display = 'none';
    descrContainer.style.display = 'none';
    weaponsContainer.style.display = 'block';
    weaponDescrContainer.style.display = 'none';

}

function showWeaponDescr(){
    charContainer.style.display = 'none';
    descrContainer.style.display = 'none';
    weaponsContainer.style.display = 'none';
    weaponDescrContainer.style.display = 'block';

}

function createCharacterCard(character){
    let cardContainer = document.createElement('div');
    let charTitle = character.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    cardContainer.innerHTML = `
    <h2>${charTitle}</h2>
    <img src="https://genshin.jmp.blue/characters/${character.name}/icon"/>
    `;


    cardContainer.addEventListener('click', () => {
        history.pushState({ character: character.name }, "", `?character=${character.name}`);
        createCharacterDescr(charDescrCard, character, charTitle);
        showCharacterDescr();

    });
    cardContainer.classList.add('character_card');
    charCardsContainer.append(cardContainer);
}

function createCharacterDescr(charDescrCard, character, charTitle){
    charDescrCard.innerHTML = '';
    charDescrCard.innerHTML = `
    <h1>${charTitle}</h1>
    <div class="character_descr">
        <img src="https://genshin.jmp.blue/characters/${character.name}/card"/>
        <div class="character_info">
            <h2>${character.title}</h2>
            <p>${character.description}</p>
            <ul>
                <li>${character.vision}</li>
                <li>${character.weapon}</li>
                <li>${character.nation}</li>
            </ul>
        </div>
    </div>
    `;
}

window.onpopstate = () => {
    checkURL();
};
  
function checkURL() {
    const params = new URLSearchParams(window.location.search);
    const charName = params.get('character');
    const weaponName = params.get('weapon');
    const section = params.get('section');

    if (charName) {
        const character = allCharacters.find(c => c.name === charName);
        if (character) {
            const charTitle = charName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            createCharacterDescr(charDescrCard, character, charTitle);
            showCharacterDescr();
        } else {
            loadCharacters(); 
        }
    } else if (weaponName) {
        const weapon = allWeapons.find(w => w.name === weaponName);
        if (weapon) {
            const weapTitle = weaponName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            createVeaponDescr(weapDescrCard, weapon, weapTitle);
            showWeaponDescr();
        } else {
            loadWeapons(); 
        }
    } else if (section === 'weapons') {
        loadWeapons();
    } else {
        loadCharacters();
    }
}

// фильтр для персов

const visionFilter = document.querySelector('.vision_filter');

visionFilter.addEventListener('change', () => {
    changeFilter(visionFilter, 'vision');
});

function changeFilter(filter, feature){
    const selectedCheckboxes = filter.querySelectorAll('input[type="checkbox"]:checked');
    const selected = Array.from(selectedCheckboxes).map(cb => cb.value);
    let filtered;

    if (selected.includes('all') || selected.length === 0) {
        filtered = allCharacters;
    } else {
        filtered = allCharacters.filter(char => selected.includes(char[feature]));
    }
    renderCharacterCards(filtered);
}

// ссылки в навбаре

let links = document.querySelectorAll('.sections_item');

links.forEach(link => {
    link.addEventListener('click', () => {
        let linkClass = link.classList.item(1);
        switch (linkClass) {
            case 'characters':
                loadCharacters();
                break;
            case 'weapons':
                history.pushState({}, '', '?section=weapons');
                loadWeapons();
                break;
          }
    });
});

 // отображение оружия

async function loadWeapons() {
    try {
        const response = await fetch('https://genshin.jmp.blue/weapons');
    const weapons = await response.json();
    showWeapons();

    const weaponsPromises = weapons.map(async (name) => {
        try {
            const response = await fetch(`https://genshin.jmp.blue/weapons/${name}`);
            const data = await response.json();
            data.name = name;
            return data;
        } catch (err) {
            console.error(err);
            return null;
        }
      });

    allWeapons = await Promise.all(weaponsPromises);
    renderWeaponCards(allWeapons);
    } catch(err){
        console.error('Error loading weapons:', err);
    }
}

function renderWeaponCards(weapons){
    weaponsCardsContainer.innerHTML = ''; 
    console.log(weapons);
    weapons.forEach(weapon => {
        console.log();
        createWeaponCard(weapon);
    });
}

function createWeaponCard(weapon){
    let weapContainer = document.createElement('div');
    let weapTitle = weapon.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    weapContainer.innerHTML = `
    <h2>${weapTitle}</h2>
    <img src="https://genshin.jmp.blue/weapons/${weapon.name}/icon"/>
    `;

    weapContainer.addEventListener('click', () => {
        history.pushState({ weapon: weapon.name }, '', `?weapon=${weapon.name}`);
        createVeaponDescr(weapDescrCard, weapon, weapTitle);
        showWeaponDescr();
    });
    weapContainer.classList.add('weapon_card');
    weaponsCardsContainer.append(weapContainer);
}

function createVeaponDescr(weapDescrCard, weapon, weapTitle){
    weapDescrCard.innerHTML = '';
    weapDescrCard.innerHTML = `
    <h1>${weapTitle}</h1>
    <div class="weapon_descr">
        <img src="https://genshin.jmp.blue/weapons/${weapon.name}/icon"/>
        <div>
            
            <p>${weapon.type}</p>
        </div>
    </div>
    `;
}

// фильтр оружия

const weaponTypeFilter = document.querySelector(".weapon_filter");

weaponTypeFilter.addEventListener('change', () => {
    changeWeaponFilter(weaponTypeFilter, 'type');
});

function changeWeaponFilter(filter, feature){
    const selectedCheckboxes = filter.querySelectorAll('input[type="checkbox"]:checked');
    const selected = Array.from(selectedCheckboxes).map(cb => cb.value);
    let filtered;
    if (selected.includes('all') || selected.length === 0) {
        filtered = allWeapons;
    } else {
        filtered = allWeapons.filter(char => selected.includes(char[feature]));
    }
    renderWeaponCards(filtered);
}

window.addEventListener('load', () => {
    checkURL();
});