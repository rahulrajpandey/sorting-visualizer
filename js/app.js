"use strict";

(function () {
  // constants
  const PRIMARY_COLOR = "cadetblue";
  const CHANGE_COLOR = "red";
  const ANIMATION_SPEED_MS = 30;

  // data structures

  const array = [];
  const animations = [];

  // AnimationStep template
  class AnimationStep {
    constructor(firstIdx, secondIdx, ifPosChange) {
      this.firstIdx = firstIdx;
      this.secondIdx = secondIdx;
      this.ifPosChange = ifPosChange;
    }
  }

  // button bindings
  var btnArrayGenElement = document.querySelector("#btnArrayGenerator");
  var btnBubbleSortElement = document.querySelector("#btnBubbleSort");
  var txtAreaElement = document.querySelector("#txtArea");
  var divBarsElement = document.querySelector("#divBars");

  btnArrayGenElement.addEventListener("click", function () {
    // generate random positive array
    array.length = 0; // clear the array

    // add 10 numbers in the range 30 to 100
    for (var count = 0; count < 10; count++) {
      array.push(getRandomInt(30, 100));
    }

    // set in the textarea
    txtAreaElement.value = array;

    // call to display array boxes into divbars div section
    showBoxes(array);
  });

  btnBubbleSortElement.addEventListener("click", function () {
    // bubble sort
    for (var i = 0; i < array.length; i++) {
      // Last i elements are already in place
      for (var j = 0; j < array.length - i - 1; j++) {
        // Checking if the item at present iteration
        // is greater than the next iteration
        animations.push(new AnimationStep(j, j + 1, false)); // change color
        animations.push(new AnimationStep(j, j + 1, false)); // back to initial color

        if (array[j] > array[j + 1]) {
          // If the condition is true then swap them
          var temp1 = array[j];
          var temp2 = array[j + 1];
          array[j] = temp2;
          array[j + 1] = temp1;

          animations.push(new AnimationStep(j, temp2, true)); // index, item height, true
          animations.push(new AnimationStep(j + 1, temp1, true)); // index, item height, true
        }
      }
    }

    // Print the sorted array
    console.log(array);

    // return animation array
    showAnimations(animations);
  });

  // function to show array boxes in divBars div
  function showBoxes(array) {
    // create box items and add into divBars
    divBarsElement.replaceChildren(); // clear the div

    // Create the fragment
    var fragment = new DocumentFragment();
    array.forEach(function (item, index) {
      const boxItem = document.createElement("div");
      boxItem.className = "box";
      boxItem.style.height = item + "px";
      fragment.appendChild(boxItem);
    });
    console.log(fragment);
    divBarsElement.appendChild(fragment);
    console.log("All Items Added");
  }

  function showAnimations(animations) {
    console.log(animations);
    const boxHTMLCollection = document.getElementsByClassName("box");

    // start animation
    for (let i = 0; i < animations.length; i++) {
      let animationStep = animations[i];

      let firstIndex = animationStep.firstIdx;
      let secondIndex = animationStep.secondIdx;
      let positionChangeCheck = animationStep.ifPosChange;

      if (positionChangeCheck) {
        const box = boxHTMLCollection.item(firstIndex);
        setTimeout(function () {
          box.style.height = secondIndex + "px";
        }, i * 300);
      } else {
        const box1 = boxHTMLCollection.item(firstIndex);
        const box2 = boxHTMLCollection.item(secondIndex);
        setTimeout(function () {
          if (i & 1) {
            // odd, set primary color
            box1.style.backgroundColor = PRIMARY_COLOR;
            box2.style.backgroundColor = PRIMARY_COLOR;
          } else {
            // set secondary color
            box1.style.backgroundColor = CHANGE_COLOR;
            box2.style.backgroundColor = CHANGE_COLOR;
          }
        }, i * 300);
      }
    } // animation ends

    console.log("DONE!");
  }

  // function to generate random number in a range
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
})();
