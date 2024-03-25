
// =-=-=-=-=| variables |=-=-=-=-=

// main :
// let wrappersCoteChoice = document.querySelectorAll('.cote-buttons')
let wrappersCoteChoice = document.querySelectorAll('.bets')
let buttons = document.querySelectorAll('button')
let mainBody = document.querySelector('.bets') 
// let chosenBets = document.querySelectorAll('.btn-bet')

// bets window :
let ongletBets = document.querySelector('.onglet')
let betRecap = document.querySelector('.bet-window--recap')
let nbrOfBets = document.querySelector('.nbr-bet')
let inputBet = document.querySelector('#input-bet')
let totalCote = document.querySelector('.total-cote')
let totalGain = document.querySelector('.total-gain')
let xdelete = document.querySelector('.fa-xmark')



let cotes = []


// =-=-=-=-=| fonctions |=-=-=-=-=

fetch(`datas.json`)
.then(response => response.json())
.then(data => {
  console.log(data);

  // affiche dans l'html tout les matchs qui existe dans le fichier json
  // math_id dans .cote-buttons pour gérer la liste des cotes choisis et dans .vs on sais jamais ._.
  for (let i = 0; i < data.matchs.length; i++) {
    mainBody.innerHTML += ` 
      <div class="vs" data-matchid="${data.matchs[i].match_id}">
        <div class="team-names">
          <span class="team team1">${data.matchs[i].hometeam}</span> - <span class="team team2">${data.matchs[i].awayteam}</span>
        </div>

        <div class="cote-buttons" data-matchid="${data.matchs[i].match_id}" data-home="${data.matchs[i].hometeam}" data-away="${data.matchs[i].awayteam}">
            <button type="button" class="bet win" data-choice="${data.matchs[i].hometeam}">${data.matchs[i].home_odd}</button>
            <button type="button" class="bet null" data-choice="Matche Null">${data.matchs[i].draw_odd}</button>
            <button type="button" class="bet lose" data-choice="${data.matchs[i].awayteam}">${data.matchs[i].away_odd}</button>
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
          <strong>${cotes[i].winner}</strong>
          <div>
            <span>${cotes[i].odds}</span>
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
        <div><small>${cotes[i].home_team} - ${cotes[i].away_team}</small>
          
        </div>
      </div>
    `
    console.log(typeof(cotes[i].odds));
  }

  let sumCotes = 1;
  for (let i = 0; i < cotes.length; i++) {
    let odds = cotes[i].odds
    console.log(odds);
    sumCotes = sumCotes * odds;
  }
  console.log(sumCotes);

  // let inputBet = document.querySelector('.input-bet')
  // let totalCote = document.querySelector('.total-cote')
  // let totalGain = document.querySelector('.total-gain')

  nbrOfBets.innerHTML = cotes.length
  totalCote.innerHTML = sumCotes.toFixed(2)
  totalGain.innerHTML = 0.00

  inputBet.addEventListener('change', () => {
  
    let potentielGain = inputBet.value * sumCotes
    totalGain.innerHTML = potentielGain.toFixed(2)
  })
}
betsTab()




// =-=-=-=-=| eventListeners |=-=-=-=-=
wrappersCoteChoice.forEach(wrapperCoteChoice => {
  wrapperCoteChoice.addEventListener('click', e => {

    // si target est un <button>
    if (e.target.tagName === 'BUTTON') {
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

        // check avec .findIndex si matchid existe déja dans la liste
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
            'winner' : e.target.getAttribute('data-choice'),
            'odds' : e.target.innerHTML,
            'home_team' : e.target.parentElement.getAttribute('data-home'),
            'away_team' : e.target.parentElement.getAttribute('data-away'),
          })
        }
      }

      // relance betsTab() pour mettre a jour en fonciton des modifs fait sur les cotes choisis + liste
      betsTab()
      console.log(cotes);
    }
  })
})


// open/close l'onglet Bets
ongletBets.addEventListener('click', () => {
  ongletBets.nextElementSibling.classList.toggle('hidden') 
})


// =-=-=-=-=| misc |=-=-=-=-=






