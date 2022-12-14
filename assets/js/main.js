import '/assets/styles/main.scss';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import Airtable from 'airtable';

/* GET DATA FROM AIRTABLE */

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: import.meta.env.VITE_AIRTABLE_API_KEY
});
const base = Airtable.base(import.meta.env.VITE_AIRTABLE_BASE_ID);
let cardContent = ``;

base('Projects').select({
    view: 'Grid view'
}).firstPage(function(err, records) {
    if (err) { 
      console.error(err); return; 
    }
    records.forEach(function(record) {
        cardContent += `
          <div class="card drag absolute cursor-grab slide-1" style="z-index:`+ record.get('zIndex') +`;">
            <img src="/assets/img/` + record.get('Image') + `" alt="image 1" title="`+ record.get('Nom') +`" code-couleur="`+ record.get('CodeCouleur') +`" font-couleur="`+ record.get('FontCouleur') +`" noise="`+ record.get('Noise') +`" style="transform: rotate(`+ record.get('Rotate') +`deg);">
          </div> `;
    });

    document.querySelector('#cards-container').innerHTML = `${cardContent}`;


    /* DRAG AND DROP */

    gsap.registerPlugin(Draggable);

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
      edgeResistance:.2,
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
      // Permet de placer la premi??re carte en dernier
      gsap.timeline({onComplete: arrayBackToFront()})
          // On place le z-index ?? 0 de la current carte
          .set(current, {zIndex: 0})
          // Puis on positionne cette m??me carte ?? la m??me position (mais derri??re, cf z-index)
          .to(current, {x: 0, y: 0, ease: "expo"});

      // On replace chaque carte (z-index) selon leur index dans le tableau
      cardsRotate();
      // On change le titre (en background) en fonction de la carte
      changeTitle();
    }

    function previousCard() {
      // Previous card permet de placer la derni??re carte en premier
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
        const rotation = [-5, 5, 0, -5, 5, 0];
        gsap.timeline()
        .set(card, {zIndex: n})
        .to(img, {rotation: rotation[n], duration: 0.5});
      });
    }

    function changeTitle() {
      // select data de la 1ere carte (dernier ??l??ment du tableau)
      let currentTitleCard = cards[5].firstElementChild.getAttribute("title");
      let currentColorCard = cards[5].firstElementChild.getAttribute("code-couleur");
      let currentColorTypo = cards[5].firstElementChild.getAttribute("font-couleur");
      let currentNoise = cards[5].firstElementChild.getAttribute("noise");
      let title = document.getElementById("projetTitle");

      gsap.timeline()
      .set(".background", {opacity: 0})
      .set(title, {color: currentColorTypo , opacity: 0, duration: 2});

      gsap.timeline({ onComplete: changeTitleHtml(currentTitleCard) })
      .set(".background", {backgroundColor: currentColorCard})
      .set(".noise", {backgroundImage: `url(/assets/img/noise-${currentNoise}.png)`})
      .to(".background", {opacity: 1, duration: 1})
      .to(title, {opacity: 1, duration: 2});
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

});