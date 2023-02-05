(() => {  
  const currentUrl = window.location.href;
  const courseId = currentUrl.split('id=')[1];
  const pointsUrl = `/moodle/grade/report/user/index.php?id=${courseId}`;

  fetch(pointsUrl)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(html, 'text/html');
      const grades = htmlDoc.querySelectorAll('.column-grade');
      const percentage = htmlDoc.querySelectorAll('.column-percentage');
      const values = getValues(grades, percentage);

      const points = Math.round(values.points);
      const amount = values.amount;
      const percentAll = values.percent;
      const percent = Math.round(values.percent / amount);
      let level = Math.floor(1 + Math.log2(percentAll / 100 + 1) * 0.7);
      const potency = points / grades.length;
      const maxCoins = 8;
      let coins = 0;
      if (amount > 0) {
        for (let i = 0; i < amount; i++) {
          coins += Math.round(Math.abs(Math.sin(i)) * maxCoins + 1.2 * potency / 100 * maxCoins);
        }
      }
      
      implementElements(level, amount, percent, points, coins);

    });
})();


getValues = (grades, percentage) => {
  let points = 0;
  let percent = 0;
  let amount = 0;
  for (let i = 0; i < grades.length; i++) {
    const gradeValue = parseFloat(grades[i].textContent.replace(',', '.'));
    const percentageValue = parseFloat(percentage[i].textContent.replace(',', '.').replace(' %', ''));
    if (!isNaN(gradeValue) && gradeValue >= 0) {
      points += gradeValue;
      percent += percentageValue;
      amount += 1;
    }
  }
  return {points, percent, amount};
};


implementElements = (level, amount, percent, points, coins) => {
  const elements = [
    { text: `<i class="fa fa-check"></i> ${amount}`, class: "col" },
    { text: `<i class="fa fa-trophy"></i> ${level}`, class: "col" },
    { text: `<i class="fa fa-pie-chart"></i> ${percent}%`, class: "col" },
    { text: `<i class="fa fa-th"></i> ${points}`, class: "col" },
    { text: `<i class="fa fa-database"></i> ${coins}`, class: "col" }
  ];

  const row = document.createElement("div");
  row.classList.add("row");
  row.style.marginBottom = "15px";
  row.style.fontSize = "x-large";
  row.style.fontFamily = "fantasy";
  row.style.color = "#2b3035";
  row.style.backgroundImage = "linear-gradient(45deg, #11510080, #002eff80)";
  row.style.textShadow = "4px 4px 7px var(--gray)";
  row.style.borderRadius = "5px";

  for (const element of elements) {
    const col = document.createElement("div");
    col.classList.add(element.class);
    col.innerHTML = element.text;
    col.style.textAlign = "center";

    row.appendChild(col);
  }

  const header = document.querySelector('#topofscroll');
  header.insertAdjacentElement("beforeend", row);
  row.style.position = "sticky";
  row.style.bottom = "5px";

};
