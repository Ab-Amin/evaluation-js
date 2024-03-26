// =-=-=-=-=| variables |=-=-=-=-=

// main :
let betsWrapper = document.querySelector('.bets')
let buttons = document.querySelectorAll('button')
let randomImg = document.querySelector('.random-img')

// bets window :
let ongletBets = document.querySelector('.onglet')
let betRecap = document.querySelector('.bet-window--recap')
let nbrOfBets = document.querySelector('.nbr-bet')
let inputBet = document.querySelector('#input-bet')
let totalCote = document.querySelector('.total-cote')
let totalGain = document.querySelector('.total-gain')
let xdelete = document.querySelectorAll('.fa-xmark')

// liste(s) :
let cotes = []


// =-=-=-=-=| fonctions |=-=-=-=-=
fetch(`datas.json`)
.then(response => response.json())
.then(data => {
  console.log(data);

  // affiche dans l'html tout les matchs qui existe dans le fichier json
  // math_id dans .cote-buttons pour gérer la liste des cotes choisis et dans .vs on sais jamais ._.
  for (let i = 0; i < data.matchs.length; i++) {
    betsWrapper.innerHTML += ` 
      <div class="vs" data-matchid="${data.matchs[i].match_id}">
        <div class="team-names">
          <span class="team team1">${data.matchs[i].hometeam}</span> - <span class="team team2">${data.matchs[i].awayteam}</span>
        </div>

        <div class="cote-buttons" data-matchid="${data.matchs[i].match_id}" data-home="${data.matchs[i].hometeam}" data-away="${data.matchs[i].awayteam}">
            1<button type="button" class="bet win" data-choice="${data.matchs[i].hometeam}">${data.matchs[i].home_odd}</button>
            x<button type="button" class="bet null" data-choice="Matche Null">${data.matchs[i].draw_odd}</button>
            2<button type="button" class="bet lose" data-choice="${data.matchs[i].awayteam}">${data.matchs[i].away_odd}</button>
        </div>
      </div>
    `
  }
})
.catch(error => {console.log("Erreur lors de la récup des données :", error)})


function betsTab() {
  // si la liste est >= 1 --> vide l'html de betRecap avant d'y ajouter les paris
  if (cotes.length >= 1) {
    betRecap.innerHTML = ""
  } else {
    betRecap.innerHTML = '<div style="text-align: center;font-size: 14px;padding: 15px 0;">Make a bet to see summary here</div>'
  }
  // affiche dans l'html toutes les info de la liste 'cotes'
  for (let i = 0; i < cotes.length; i++) {
    betRecap.innerHTML += `
      <div class="ticket" data-matchid="${cotes[i].match_id}">
        <div>
          <strong>${cotes[i].chosen_winner}</strong>
          <div>
            <span>${cotes[i].odds}</span>
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
        <div><small>${cotes[i].home_team} - ${cotes[i].away_team}</small>
          
        </div>
      </div>
    `
    // console.log(typeof(cotes[i].odds));
  }
  // = 1 sinon donnera 0 tout le temps (*0)
  let multiCotes = 1;
  for (let i = 0; i < cotes.length; i++) {
    let odds = cotes[i].odds
    // console.log(odds);
    multiCotes = multiCotes * odds;
  }
  // console.log(multiCotes);
  
  nbrOfBets.innerHTML = cotes.length
  // arondi à 2 chiffre aprés virgule
  totalCote.innerHTML = multiCotes.toFixed(2)

  // trouve pas comment mettre à jour sans cliqué sur 'enter'
  // essayé avec keypress mais ça prend que les 2 premier chiffre, ex 1234€ * cote de 1.00 => 123€
  inputBet.addEventListener('change', () => {
    let potentielGain = inputBet.value * multiCotes
    totalGain.innerHTML = potentielGain.toFixed(2)
  })
}
betsTab()


// =-=-=-=-=| eventListeners |=-=-=-=-=
betsWrapper.addEventListener('click', e => {

  // si target est un <button> dans betsWrapper
  if (e.target.tagName === 'BUTTON') {
    // affiche l'onglet bets
    ongletBets.nextElementSibling.classList.remove('hidden') 

    // si target contiens deja la class .btn-bet --> lui enleve la class
    if (e.target.classList.contains('btn-bet')) {
      e.target.classList.remove('btn-bet')
    } else {
      // sinon enleve les class .btn-bet de tout les siblings et rajoute la class au target 
      if (e.target.parentElement.querySelector('.btn-bet')){
        e.target.parentElement.querySelector('.btn-bet').classList.remove('btn-bet')
      } 
      e.target.classList.add('btn-bet')
    }
    // si on change de choix de cote (ou juste cliqué sur un nouveau) --> add la cote + nom de team gagnant dans liste
    if (e.target.parentElement.hasAttribute('data-matchid')){

      // check avec .findIndex si cotes.matchid existe déja dans la liste (si est == à data-matchid du parent.target)
      let existInList = cotes.findIndex(item => item.match_id === e.target.parentElement.getAttribute('data-matchid'));

      // si on enleve un pari (si ne contien pas la blasse btn-bet) --> supprime l'objet en entier de la liste   
      if (e.target.classList.contains('btn-bet') == false) {
        if (existInList != -1){
          cotes.splice(existInList, 1);
        }
      } else {
        // findIndex return -1 si l'element cherché n'a pas été trouvé, 
        // du coup si different de -1 --> supprime existInList (objet avec le match_id) de la liste 
        if (existInList != -1){
          cotes.splice(existInList, 1);
        }
        // et on le remplaçera avec des nouvelles valeur
        cotes.push({
          'match_id' : e.target.parentElement.getAttribute('data-matchid'),
          'chosen_winner' : e.target.getAttribute('data-choice'),
          'odds' : e.target.innerHTML,
          'home_team' : e.target.parentElement.getAttribute('data-home'),
          'away_team' : e.target.parentElement.getAttribute('data-away'),
        })
      }
    }
    // relance betsTab() pour mettre à jour en fonciton des modifs fait sur les cotes choisis
    betsTab()
    console.log(cotes);
  }
})


// delete mini-windoww bets 
betRecap.addEventListener('click', e => {

  // prend le numero de l'attribut data-matchid du .ticket
  let xMatchid = e.target.closest('.ticket').getAttribute('data-matchid')
  // console.log(xMatchid);
  
  // si target est un <i>
  if (e.target.tagName === 'I') {
    
    // trouve l'index d'ou le xMatchid se situe dans la liste 'cotes'
    let idInCotesList = cotes.findIndex(item => item.match_id === xMatchid);
    
    // ensuite enlever cet element de la liste 'cotes' grace à la position (index) donnée par idInCotesList
    cotes.splice(idInCotesList, 1)
    
    // supprime totalement le paris du mini-window
    e.target.parentElement.parentElement.parentElement.remove()

    // relance betsTab() pour mettre à jour l'onglet des paris en fonciton de ce que j'ai supprimé
    betsTab()
    console.log(cotes);
  }
  // remove "active" en fonction des delete fait sur onglet bets :
  // cherche un element dans mainBody avec le data-matchid qui correspont à xMatchid (ligne 160)
  if (betsWrapper.querySelector(`[data-matchid="${xMatchid}"]`)) {

    // ensuite cherche dans les enfants de cet elements qui contient la class 'btn-bet' (qui donne couleur css) pour le removve
    betsWrapper.querySelector(`[data-matchid="${xMatchid}"]`).querySelector('.btn-bet').classList.remove('btn-bet')
  }

})


// open/close l'onglet Bets :
ongletBets.addEventListener('click', () => {
  ongletBets.nextElementSibling.classList.toggle('hidden') 
})


//toggle light/dark mode :
document.querySelector('.light-dark').addEventListener('click', () => {

  // rajoute/enleve la classe 'light-mode' du body a chaque clique
  document.querySelector('body').classList.toggle('light-mode')

  // si body contient 'light-mode' --> dans l'html de 'light-dark' replace l'icone présent par icon soleil sinon icon de lune 
  if (document.querySelector('body').classList.contains('.ligh-mode')) {
    document.querySelector('.light-dark').innerHTML = '<i class="fa-solid fa-sun"></i>'
  } else {
    document.querySelector('.light-dark').innerHTML = '<i class="fa-solid fa-moon"></i>'
  }
})


// random image in background :
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
const rdmNbr = randomIntFromInterval(1, 3)
randomImg.innerHTML = `<img src="img/bg${rdmNbr}.webp" alt="">`