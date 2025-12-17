let xValues = ["Correct", "Wrong"];
let yValues = [55, 49];
let barColors = ["#b91d47", "#00aba9"];
window.addEventListener("load", () => {
  const graph = document.getElementById("#graph"); // inserisci codice qui
  new Chart("myChart", {
    type: "doughnut",
    data: {
      datasets: [
        {
          backgroundColor: barColors,
          data: yValues,
        },
      ],
    },
    options: {
      cutoutPercentage: 70,
      tooltips: {
        enabled: false,
      },
    },
  });
});


// LOGICA per mostrare il numero e percentuale di domande giuste e sbagliate
// domande giuste = totale domande / numero domande giuste
// domande sbagliate = totale domande / numero domande sbagliate

