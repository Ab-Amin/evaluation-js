
// =-=-=-=-=| variables |=-=-=-=-=

let wrappersCoteChoice = document.querySelectorAll('.cote-buttons')
let buttons = document.querySelectorAll('button')

let mainBody = document.querySelector('.bets') 

let cote = []



// =-=-=-=-=| fonctions |=-=-=-=-=
  
fetch(`datas.json`)
  .then(response => response.json())
  .then(data => {
    console.log(data);

    for (let i = 0; i < data.matchs.length; i++) {
      mainBody.innerHTML += ` 
        <div class="vs" data-matchid="${data.matchs[i].match_id}">
          <div class="team-names">
            <span class="team team1">${data.matchs[i].hometeam}</span> - <span class="team team2">${data.matchs[i].awayteam}</span>
          </div>

          <div class="cote-buttons">
              <button type="button" class="bet win" data-choice="${data.matchs[i].hometeam}">${data.matchs[i].home_odd}</button>
              <button type="button" class="bet null" data-choice="Matche Null">${data.matchs[i].draw_odd}</button>
              <button type="button" class="bet lose" data-choice="${data.matchs[i].awayteam}">${data.matchs[i].away_odd}</button>
          </div>
        </div>
      `
    }


  })
  .catch(error => {console.log("Erreur lors de la récup des données :", error)
})


console.log('test')

// =-=-=-=-=| eventListeners |=-=-=-=-=

wrappersCoteChoice.forEach(wrapperCoteChoice => {
  
  wrapperCoteChoice.addEventListener('click', e => {

    console.log('*click*');

    // if target is a <button>
    if (e.target.tagName === 'BUTTON') {
      // if targer already contains the class .btn-bet -> removes it
      if (e.target.classList.contains('btn-bet')) {
        e.target.classList.remove('btn-bet')
      } else {
        // else removes every sibling's class with .btn-bet and then add the class to target
        if (e.target.parentElement.querySelector('.btn-bet')){
          e.target.parentElement.querySelector('.btn-bet').classList.remove('btn-bet')
        } 
        e.target.classList.add('btn-bet')
      }
    }

    console.log(e.target.innerHTML);
  })
})






// =-=-=-=-=|  |=-=-=-=-=
















