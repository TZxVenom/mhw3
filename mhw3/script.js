function answerChoice(event) {
    event.currentTarget.classList.add('clicked');
    const checkbox = event.currentTarget.querySelector('.checkbox');
    checkbox.src="images/checked.png";
    let overlay= event.currentTarget.querySelector('.overlay');
    if(!overlay.classList.contains('hidden'))
    {
      overlay.classList.add('hidden');
    }
    
    for(const div of elementList) {
    if(div.dataset.questionId === event.currentTarget.dataset.questionId && div !== event.currentTarget)
    {
    let overlay=div.querySelector('.overlay');
    overlay.classList.remove('hidden');
    if(div.classList.contains('clicked'))
      {
      div.classList.remove('clicked');
      const img=div.querySelector('.checkbox');
      img.src="images/unchecked.png";
      }  
    } 
  }
answers[event.currentTarget.dataset.questionId]= event.currentTarget.dataset.choiceId;
if(Object.keys(answers).length==3) {
  for(let div of elementList) {
    div.removeEventListener('click',answerChoice);
  }
  getChoiceId();
  }
}

function getChoiceId() {
  let index;
  if(answers["one"] === answers["two"] || answers["one"] === answers["three"]){
    index = answers["one"]
    showResult(RESULTS_MAP[index].title, RESULTS_MAP[index].contents)
}
else if(answers["two"] === answers["three"]) {
    index = answers["two"]
    showResult(RESULTS_MAP[index].title, RESULTS_MAP[index].contents)
}
else {
    index = answers["one"]
    showResult(RESULTS_MAP[index].title, RESULTS_MAP[index].contents)
     }
}

function showResult (title, description) {
  let titl = result.querySelector('#title')
  let descrip = result.querySelector('#quote')
  let button = result.querySelector('.button')
  let zooButton = document.querySelector('#ZooApi .button')
  titl.textContent = title
  descrip.textContent = description
  button.addEventListener('click', reset)
  result.classList.remove('hidden')
  zoo.classList.remove('hidden')
  zooButton.addEventListener('click', sendRequest) 
}

function onResponse(response){
  return response.json();
}

function getToken(json)
{
	token_data = json;
	console.log(json);
}

function onTokenResponse(response) {
  return response.json();
}

function onJson_Zoo(json){
  console.log(json);
  const objects = json;
  const newGrid = document.querySelector('#newGrid')
  newGrid.classList.add('choice-grid')
  newGrid.classList.remove('hidden')
  newGrid.innerHTML=''
  
  for (let element of objects) {
    const imageContainer = document.createElement('div');
    const textContainer = document.createElement('div');
    imageContainer.classList.add('choice')
    textContainer.classList.add('textContainer');
    const img = document.createElement('img')
    img.src = element.image_link;
    imageContainer.appendChild(img)
    const paragraph = document.createElement('p')
    paragraph.textContent = 'Name: ' + element.name + '\\\\\\Animal Type: ' + element.animal_type + '\\\\\\Diet: '+ element.diet + '\\\\\\Habitat: ' + element.habitat 
    textContainer.appendChild(paragraph);
    newGrid.appendChild(imageContainer);
    newGrid.appendChild(textContainer);
  }
}

function onJson_pet(json){
  console.log(json);
  const results = json.animals

  if(results.length == 0)
  {
	const errore = document.createElement("h1"); 
	const messaggio = document.createTextNode("Nessun risultato!"); 
	errore.appendChild(messaggio); 
	library.appendChild(errore);
  }

  const album   = document.querySelector('#album-view');
  album.classList.add('choice-grid');
  album.innerHTML='';

  for(let element of results) {
    if(element.primary_photo_cropped != null){
      const container = document.createElement('div');
      container.classList.add('choice')
      const immagine = element.primary_photo_cropped.medium;
      const img = document.createElement('img');
      img.src=immagine;
      container.appendChild(img)
      const breed = document.createElement('h3');
      const name = document.createElement('h4');
      const size = document.createElement('h5');
      breed.textContent = element.breeds.primary;
      name.textContent = 'Name: ' + element.name
      size.textContent = 'Size: ' + element.size
		  container.appendChild(breed);
      container.appendChild(name);
      container.appendChild(size);
		  album.appendChild(container);
    }
  }
}

function sendRequest(){
  fetch('https://zoo-animal-api.herokuapp.com/animals/rand/3').then(onResponse).then(onJson_Zoo)
}

function search(event){
  event.preventDefault();
  const content = document.querySelector('#content').value;
  const text = encodeURIComponent(content);
  const status = 'adoptable'
			fetch('https://api.petfinder.com/v2/animals?type=' + text + '&status=' + status, 
			{
				headers: {
					'Authorization': token_data.token_type + ' ' + token_data.access_token,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(onResponse).then(onJson_pet);
}

function reset(event) {
  for(const div of elementList) {
    div.addEventListener('click', answerChoice)
    let overlay= div.querySelector('.overlay'); 
    if(div.classList.contains('clicked')){
      div.classList.remove('clicked')
      div.querySelector('.checkbox').src = './images/unchecked.png'
      }

  else if(!overlay.classList.contains('hidden')){ 
      overlay.classList.add('hidden')
      }
  }
  answers = {}
  event.currentTarget.removeEventListener('click', reset)
  result.classList.add('hidden')
  zoo.classList.add('hidden')
  newGrid.classList.add('hidden')
}

function apriModale(event) {
	const div = document.querySelector('#modale');
  const container =document.querySelector('#container')
  container.classList.add('hidden')
	div.classList.remove('hidden')
}

function chiudiModale(event) {
	console.log(event);
	if(event.key === 'Escape')
	{
  const div = document.querySelector('#modale');
  const container =document.querySelector('#container')
  const album   = document.querySelector('#album-view');
	div.classList.add('hidden')
  container.classList.remove('hidden')
  album.innerHTML='';
	}
}

//Key and secret OAuth2.0 
const key_petfinder = '9isTMwKYZcwnjtqFZi8N5p5vMONWFLSFUodECscLOJOfG4xBXC'
const secret_petfinder = 'kD7T86bjAwDnysuXL5JSdalqw8b8gK8evImR7RYb'
const pet_api_endpoint_token = 'https://api.petfinder.com/v2/oauth2/token' 
const pet_api_endpoint = 'https://api.petfinder.com/v2/animals' 

let token_data;
fetch(pet_api_endpoint_token,
{
	method: 'POST',
	body: 'grant_type=client_credentials&client_id=' + key_petfinder + '&client_secret=' + secret_petfinder,
	headers:
	{
		'Content-Type': 'application/x-www-form-urlencoded'
	}
}
).then(onTokenResponse).then(getToken);

const elementList = document.querySelectorAll('.choice-grid .choice');
const result = document.querySelector('#result')
const zoo = document.querySelector('#ZooApi')
const newGrid = document.querySelector('#newGrid')
const form = document.querySelector('#search_content');
form.addEventListener('submit', search)
form.addEventListener('submit', apriModale)
let answers= {}

 for(const div of elementList)
 {
     div.addEventListener('click', answerChoice);
 }

 window.addEventListener('keydown', chiudiModale);
