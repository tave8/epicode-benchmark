let indiceProssimaDomanda = 0;
let ultimoSetInterval = null;
let ultimoSetIntervalCiambella = null;

// questo contatore conta il totale delle risposte giuste
let contatoreRisposteGiuste = 0;

function main() {
  // questo viene triggerato quando la pagina si carica
  window.addEventListener("load", () => {
    // passa subito alla prossima domanda
    passaAProssimaDomanda();
    //   configura/aggiungi event listeners
    addEventListeners();
  });
}
main();

function addEventListeners() {
  const bottoniRisposta = document.querySelectorAll(".risposte > .bottoni");
  bottoniRisposta.forEach((bottone) => {
    bottone.addEventListener("click", handleClickBottoneRisposta);
  });
}

function handleClickBottoneRisposta(ev) {
  // prendi il valore della risposta nel campo html
  const rispostaCliccataDaUtente = ev.target.innerText;
  // comparalo con la risposta giusta della domanda attuale
  const indiceDomandaAttuale = indiceProssimaDomanda - 1;

  const rispostaGiustaReale = questions[indiceDomandaAttuale].correct_answer;

  // console.log("indice domanda attuale: ", indiceProssimaDomanda);
  // console.log("risposta cliccata da utente: ", rispostaCliccataDaUtente);
  // console.log("risposta giusta reale: ", rispostaGiustaReale);

  const rispostaEGiusta = rispostaGiustaReale === rispostaCliccataDaUtente;

  if (rispostaEGiusta) {
    contatoreRisposteGiuste += 1;
  }

  passaAProssimaDomanda({
    // bottonCliccatoEl: ev.target,
  });
}

const passaAProssimaDomanda = function (config = {}) {
  // const { bottonCliccatoEl } = config;

  // togli, da tutti gli elementi html che hanno la classa risposta-selected, la classa risposta-selected
  // document.querySelectorAll(".risposta-selected").forEach((el) => el.classList.remove("risposta-selected"));

  // if (bottonCliccatoEl) {
  // quando utente clicca una risposta, marcare quella risposta come evidenziata
  // bottonCliccatoEl.classList.add("risposta-selected");
  // }

  if (haiTerminatoDomande()) {
    passaAPaginaRisultati();
    // passa alla prossima pagina
    return;
  }

  const prossimaDomanda = questions[indiceProssimaDomanda];
  //   incremento il contatore attuale
  indiceProssimaDomanda += 1;

  aggiornaDomandaUI(prossimaDomanda);

  //   TODO: fare meccanismo timer
  // aggiornare l'elemento html interessato ad ogni

  //   DISATTIVA TEMPORANEAMENTE TIMER PER POTER LAVORARE NELLA PAGINA
  attivaTimerUI({
    countdownSecondi: prossimaDomanda.countdownSecondi,
  });

  // initCiambella();

  // verifica che le domande non siano già arrivate alla fine
  // if () {

  // }

  //   aggiorna anche il numero di domande nel footer
  aggiornaNumeroDomandeUI(indiceProssimaDomanda);
};

function attivaTimerUI({ countdownSecondi }) {
  const timerEl = document.querySelector("header > .right > .timer > span");
  let secondiRimasti = countdownSecondi;

  // questa funzionalità permette di pulire il setInterval precedente,
  // questo evita il problema di setInterval che si "accavallano"
  clearInterval(ultimoSetInterval);

  const intervalloTempo = () => {
    // verifica se il tempo arriva allo zero
    // se si, passa alla prossima domanda
    const eTempoAZero = secondiRimasti === 0;
    const mancaUnSecondo = secondiRimasti === 1;

    if (mancaUnSecondo) {
      // svuotaCiambella();
    }

    // se il tempo è a zero, passa alla prossima domanda
    if (eTempoAZero) {
      // svuotaCiambella()
      passaAProssimaDomanda();
    }
    // altrimenti (se il timer è ancora attivo) aggiorna
    // il timer nell'UI
    else {
      timerEl.textContent = secondiRimasti;
    }

    aggiornaCiambella({
      secondiTotali: countdownSecondi,
      secondiRimasti: secondiRimasti,
    });

    // il nuovo tempo sarà il tempo attuale - 1 (secondo)
    secondiRimasti = secondiRimasti - 1;
  };

  // salva l'ultimo setInterval così potrai cancellare l'esecuzione
  // della funzione che c'era all'interno
  ultimoSetInterval = setInterval(() => {
    intervalloTempo();
  }, 1000);

  intervalloTempo();
}

function riempiCiambella() {
  // console.log("inizializzato ciambella");
  const ring = getCiambellaRingEl();
  const CIRC = calcolaCIRC(48);

  // ring.style.strokeDasharray = CIRC;
  ring.style.strokeDashoffset = 0;
}

function svuotaCiambella() {
  // console.log("inizializzato ciambella");
  const ring = getCiambellaRingEl();
  const CIRC = calcolaCIRC(48);

  // ring.style.strokeDasharray = 0;
  ring.style.strokeDashoffset = 0;
}

// ciambella timber
function aggiornaCiambella({ secondiTotali, secondiRimasti }) {
  const ring = getCiambellaRingEl();
  const CIRC = calcolaCIRC(48);
  const progress = secondiRimasti / secondiTotali;
  let num = CIRC * (1 - progress);
  // se il valore di strokeDashoffset sarà maggiore del massimo (283)
  // allora azzera la strokeDashoffset, questo significa "la ciambella è di nuovo piena"
  if (num >= 283) {
    num = 0;
  }
  ring.style.strokeDashoffset = num;
}

function getCiambellaRingEl() {
  return document.querySelector(".timer > .ringsvg > .ringprogress");
}

function calcolaCIRC(radius) {
  return 2 * Math.PI * radius;
}

function aggiornaNumeroDomandeUI(indiceProssimaDomanda) {
  const testoConNumDomanda = `QUESTION ${indiceProssimaDomanda} / ${questions.length}`;
  document.querySelector("footer .questionNumber").textContent = testoConNumDomanda;
}

function passaAPaginaRisultati() {
  const totDomande = questions.length;
  const totDomandeGiuste = contatoreRisposteGiuste;
  const totDomandeSbagliate = totDomande - totDomandeGiuste;

  const risultatiTest = {
    totDomande,
    totDomandeGiuste,
    totDomandeSbagliate,
  };

  const risultatiTestStr = JSON.stringify(risultatiTest);

  const url = `/results.html?risultatiTest=${risultatiTestStr}`;
  window.location.href = url;
}

// SCHEMA DOMANDA
//   {
//     category: "Science: Computers",
//     type: "multiple",
//     difficulty: "easy",
//     question: "In the programming language Java, which of these keywords would you put on a variable to make sure it doesn&#039;t get modified?",
//     correct_answer: "Final",
//     incorrect_answers: ["Static", "Private", "Public"],
//     countdownSecondi: 40,
//   },
function aggiornaDomandaUI(domandaObj) {
  // prendi l'html di interesse
  // html domanda
  const domandaEl = document.querySelector(".question > h1");
  domandaEl.textContent = domandaObj.question;
  const tutteRisposte = ottieniTutteRisposte(domandaObj);
  let indiceRisposta = 0;

  const bottoniRisposteEl = document.querySelectorAll(".risposte > .bottoni");

  // siccome alcune domande hanno un numero variabili di risposte,
  // nello specifico o 2 o 4, allora vanno eliminati gli elementi html
  // in più. si assume che l'html delle risposte avrà sempre 4 elementi html.
  const secondoContenitoreRisposte = document.querySelectorAll(".risposte")[1];

  // quando la domanda ha due risposte, nascondi il secondo contenitore
  if (tutteRisposte.length === 2) {
    // elimina il secondo (si assume che sia anche l'ultimo) contenitore
    // di risposte. il contenitore di risposte si identifica con .risposte
    secondoContenitoreRisposte.style.display = "none";
  }
  // quando la domanda ha quattro risposte, mostra il secondo contenitore
  else if (tutteRisposte.length === 4) {
    secondoContenitoreRisposte.style.display = "block";
  }

  tutteRisposte.forEach((testoRisposta) => {
    bottoniRisposteEl[indiceRisposta].textContent = testoRisposta;
    indiceRisposta += 1;
  });
}

// TODO: inserire funzionalità per randomizzare l'inserimento della risposta corretta
function ottieniTutteRisposte(domandaObj) {
  const correctAnswer = domandaObj.correct_answer;
  const incorrectAnswers = domandaObj.incorrect_answers;
  const allAnswers = [correctAnswer, ...incorrectAnswers];
  return allAnswers;
}

function haiTerminatoDomande() {
  return indiceProssimaDomanda === questions.length;
}
