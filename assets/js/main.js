import '/assets/styles/main.scss';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

/* document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
` */

/* DRAG AND DROP SLIDER */

let prev = document.getElementById('prevButton');
let prevPos = prev.getBoundingClientRect();
let next = document.getElementById('nextButton');
let nextPos = next.getBoundingClientRect();
let cards = gsap.utils.toArray(".card");
const mbtnLeft = document.getElementById("prevButton");
const mbtnRight = document.getElementById("nextButton");
let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
var screenSize = window.matchMedia('(max-width: 720px)');

Draggable.create('.card', {
  type: 'x, y',
  bounds: document.getElementById("cards-container"),
  inertia: true,
  onDrag: function(e) {
    if (e.x <= prevPos.x * 2.2) {}
    if (e.x >= nextPos.x / 1.1) {}
  },
  onDragEnd: function(e) {
    const x = 0;
    const y = 0;
    let boundingRectCard = cards[0].getBoundingClientRect();
    let relX = e.pageX - boundingRectCard.left;

    if (((relX >= 500) || (relX <= 0)) && (!screenSize.matches)) {

      nextCard(this.target);

    } else if (screenSize.matches) {
      
      nextCard(this.target);
      
    } else {
      
      gsap.to(this.target, {x: x, y: y, ease: "expo"}); 
    
    }
  }
});


function nextCard(current) {
  // Permet de placer la première carte en dernier
  gsap.timeline({onComplete: arrayBackToFront()})
       // On place le z-index à 0 de la current carte
      .set(current, {zIndex: 0})
      // Puis on positionne cette même carte à la même position (mais derrière, cf z-index)
      .to(current, {x: 0, y: 0, ease: "expo"});

  // On replace chaque carte (z-index) selon leur index dans le tableau
  cardsRotate();
  // On change le titre (en background) en fonction de la carte
  changeTitle();
}

function previousCard() {
  // Previous card permet de placer la dernière carte en premier
  gsap.timeline({onComplete: arrayFrontToBack()});
  // On replace chaque carte (z-index) selon leur index dans le tableau
  cardsRotate();
  // On change le titre (en background) en fonction de la carte
  changeTitle();
}

function arrayBackToFront() {
  cards.unshift(cards.pop());
}

function arrayFrontToBack() {
  cards.push(cards.shift());
}

function cardsRotate() {
  cards.forEach(card => {
    let n = cards.indexOf(card);
    let img = card.firstElementChild;
    const rotation = [5, 0, -5, 5, 0];
    gsap.timeline()
    .set(card, {zIndex: n})
    .to(img, {rotation: rotation[n], duration: 0.5});
  });
}

function changeTitle() {
  let currentTitleCard = cards[4].firstElementChild.getAttribute("title");
  let title = document.getElementById("projetTitle");

  gsap.timeline().set(title, {opacity: 0, duration: 2});

  gsap.timeline({ onComplete: changeTitleHtml(currentTitleCard) }).to(title, {opacity: 1, duration: 2});

  // document.querySelector('#projetTitle').innerHTML = `
    // <h1>${currentTitleCard}</h1>
  // `;

  // gsap.to(title, {opacity: 1, duration: 0.5});
}

function changeTitleHtml(currentTitle) {
  document.querySelector('#projetTitle').innerHTML = `
    <h1>${currentTitle}</h1>
  `;
}

// on Click
mbtnLeft.addEventListener('click', function () {
  previousCard();
});

mbtnRight.addEventListener('click', function () {
  nextCard(cards[0]);
});

/* END DRAG AND DROP SLIDER */

/* MAGNETIC BUTTON EFFECT */

let mButton = document.querySelectorAll('.magneticButton');

function doMagnetic(e, mbtn, movement) {
  // let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let boundingRect = mbtn.mCircle.getBoundingClientRect();
  let relX = e.pageX - boundingRect.left;
  let relY = e.pageY - boundingRect.top;

  gsap.to(mbtn.mContent, {
    x: (relX - boundingRect.width / 2) * (movement + 0.2),
    y: (relY - boundingRect.height / 2 - scrollTop) * (movement + 0.2),
    ease: "power1",
    duration: 0.6
  });

  gsap.to(mbtn.mCircle, {
    x: (relX - boundingRect.width / 2) * movement,
    y: (relY - boundingRect.height / 2 - scrollTop) * movement,
    ease: "power1",
    duration: 0.6
  });

};

mButton.forEach(function (mbtn) {
  mbtn.mCircle = mbtn.querySelector(".circle");
  mbtn.mContent = mbtn.querySelector(".buttonTitle");

  mbtn.addEventListener("mousemove", function(e) {
    doMagnetic(e, mbtn, 1);
  });
  
  mbtn.addEventListener("mouseleave", function (e) {
    gsap.to(mbtn.mContent, {
      scale: 1,
      x: 0,
      y: 0,
      ease: "power3",
      duration: 0.6
    });
    gsap.to(mbtn.mCircle, {
      scale: 1,
      x: 0,
      y: 0,
      ease: "power3",
      duration: 0.6
    });
  });
});

/* END MAGNETIC BUTTON EFFECT */