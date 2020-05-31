// noprotect

// constants/defaults
const AXIOM = "X",
  SEED_ITERATIONS = 1,
  SEED_ANGLE = 25,
  SEED_BRANCH_LENGTH = 50,
  SEED_BRANCH_WIDTH = 1,
  SEED_LEAF_MIN = 3,
  SEED_LEAF_MAX = 16,
  SEED_VARIANCE = 0.50;

// input vars
var sentence, iterations, angle,
  leafMinSize, leafMaxSize, branchLength,
  prevVariation, variation, randX, randY, branchWidth,
  leafColor, leaf2Color, leaf3Color, branchColor;

// sliders
var strokeWeightSlider, angleSlider,
  leafMinSizeSlider, leafMaxSizeSlider,
  branchLengthSlider, varianceSlider;

var originalRules = [],
  rules = [];

function initRules() {
  originalRules[0] = {
    a: "X",
    b: "[-FX][+FX][FX]+F--F++F+[[X]-X]-F[-FX]+X",
  };

  originalRules[1] = {
    a: "F",
    b: "FF"
  };

  originalRules[2] = {
    a: "X",
    b: "F+[[X]-X]-F[-FX]+X[FX]+F--F++F+[[X]-X]",
  };

  originalRules[2] = {
    a: "F",
    b: "FXFXF"
  };

  rules = originalRules;
}

function initSeed() {
  // init sentence to default
  sentence = AXIOM;

  // init settings to default
  iterations = SEED_ITERATIONS;
  angle = SEED_ANGLE;
  branchWidth = SEED_BRANCH_WIDTH;
  branchLength = SEED_BRANCH_LENGTH;
  leafMinSize = SEED_LEAF_MIN;
  leafMaxSize = SEED_LEAF_MAX;
  variation = SEED_VARIANCE;
  prevVariation = variation;

  leafColor = color(100, 200, 0, 255);
  leaf2Color = color(255, 255, 0, 155);
  leaf3Color = color(255, 0, 255, 150);
  branchColor = color(166, 128, 100, 150);

  // init sliders to default
  angleSlider.value(angle);
  strokeWeightSlider.value(branchWidth);
  branchLengthSlider.value(branchLength);
  leafMinSizeSlider.value(leafMinSize);
  leafMaxSizeSlider.value(leafMaxSize);
  varianceSlider.value(variation);
}

function reset() {
  rules = originalRules;
  initSeed();
  initRules();
  createPlant();
}

function getRandomColor() {
  var r = random(0, 255);
  var g = random(0, 255);
  var b = random(0, 255);
  var a = random(10, 255);
  return color(r, g, b, a);
}

function randomizeColors() {
  leafColor = getRandomColor();
  leaf2Color = getRandomColor();
  leaf3Color = getRandomColor();
  branchColor = getRandomColor();
  createPlant();
}

function randomizeRules() {
  var n = random(1, 10);
  var actionString = "";
  while (n > 0) {

    var insertIdx = floor(random(1, sentence.length - 1));
    var actionIdx = floor(random(1, sentence.length - 1));

    while (insertIdx == actionIdx) {
      actionIdx = round(random(1, sentence.length - 1));
    }

    actionString = sentence[actionIdx];
    if (actionString == "[") {
      actionString += "]";
    } else if (actionString == "]") {
      actionString = "[-" + actionString;
    }

    actionString += sentence.slice(0, insertIdx) +
      actionString +
      sentence.slice(insertIdx);

    n--;
  }

  var a = random([true, false]);
  if (a) {
    sentence = actionString;
  } else {
    sentence += actionString;
  }

  var shouldAngle = random([true, false]);

  if (shouldAngle) {
    angle = random(0, 5);
  } else {
    angle = 25;
  }

  variance = random(0.01, 1);

  var shouldChangeColor = random([true, false]);

  if (shouldChangeColor) {
    randomizeColors();
  }
  generate();
}

function createButtons(parentDiv) {
  var buttonDiv = createDiv();
  buttonDiv.style("display", "flex");
  buttonDiv.style("flex-direction", "row");

  var genBtn = createButton("Generate/Evolve Plant");
  genBtn.mousePressed(generate);

  var randomColorBtn = createButton("Randomize Colors");
  randomColorBtn.mousePressed(randomizeColors);

  var randomBtn = createButton("Randomize Rule Set");
  randomBtn.mousePressed(randomizeRules);

  var reInitBtn = createButton("Reset");
  reInitBtn.mousePressed(reset);

  buttonDiv.child(genBtn);
  buttonDiv.child(randomColorBtn);
  buttonDiv.child(randomBtn);
  buttonDiv.child(reInitBtn);

  parentDiv.child(buttonDiv);
}

function createSliders(parentDiv) {
  var sliderDiv = createDiv();
  sliderDiv.style("display", "flex");
  sliderDiv.style("flex-direction", "column");

  var varianceP = createP("Variance");
  varianceP.style("color", "white");
  varianceSlider = createSlider(0.01, 1, SEED_VARIANCE, 0.01);
  varianceSlider.input(createPlant);
  varianceP.child(varianceSlider);

  var angleSliderP = createP("Angle");
  angleSliderP.style("color", "white");
  angleSlider = createSlider(-120, 120, SEED_ANGLE, 0.10);
  angleSlider.input(createPlant);
  angleSliderP.child(angleSlider);

  var strokeWeightP = createP("Branch Width");
  strokeWeightP.style("color", "white");
  strokeWeightSlider = createSlider(1, 8, SEED_BRANCH_WIDTH, 0.10);
  strokeWeightSlider.input(createPlant);
  strokeWeightP.child(strokeWeightSlider);

  var blenSliderP = createP("Branch Length");
  blenSliderP.style("color", "white");
  branchLengthSlider = createSlider(1, 100, SEED_BRANCH_LENGTH, 1);
  branchLengthSlider.input(createPlant);
  blenSliderP.child(branchLengthSlider);

  var leafMinP = createP("Leaf Min Size");
  leafMinP.style("color", "white");
  leafMinSizeSlider = createSlider(0, 30, SEED_LEAF_MIN, 0.01);
  leafMinSizeSlider.input(createPlant);
  leafMinP.child(leafMinSizeSlider);

  var leafMaxP = createP("Leaf Max Size");
  leafMaxP.style("color", "white");
  leafMaxSizeSlider = createSlider(0, 30, SEED_LEAF_MAX, 0.01);
  leafMaxSizeSlider.input(createPlant);
  leafMaxP.child(leafMaxSizeSlider);

  sliderDiv.child(varianceP);
  sliderDiv.child(angleSliderP);
  sliderDiv.child(strokeWeightP);
  sliderDiv.child(blenSliderP);
  sliderDiv.child(leafMinP);
  sliderDiv.child(leafMaxP);

  parentDiv.child(sliderDiv);
}


function generate() {
  var nextSentence = "";
  for (var i = 0; i < sentence.length; i++) {
    var current = sentence.charAt(i);
    var found = false;
    for (var j = 0; j < rules.length; j++) {
      if (current == rules[j].a) {
        found = true;
        nextSentence += rules[j].b;
        break;
      }
    }
    if (!found) {
      nextSentence += current;
    }
  }
  sentence = nextSentence;
  createPlant();
  iterations++;
}

function initPropertiesPanel() {
  angle = angleSlider.value();

  leafMinSize = leafMinSizeSlider.value();
  leafMaxSize = leafMaxSizeSlider.value();
  variation = varianceSlider.value();
  branchWidth = strokeWeightSlider.value();

  var calcBranchLength = branchLengthSlider.value() * 0.50 *
    0.50 * variation;
  branchLength = max(2.2, calcBranchLength);

  var initialX = 20;
  var initialY = 30;

  textSize(16);
  fill(255, 255, 255, 160);
  strokeWeight(1);
  text("Properties", initialX, initialY);

  textSize(12);
  text("Iterations : " + iterations, initialX, initialY += 20);
  text("Angle : " + angle + " degrees", initialX, initialY += 20);
  text("Branch Width : " + branchWidth, initialX, initialY += 20);
  text("Branch Length : " + branchLengthSlider.value(), initialX, initialY += 20);
  text("Leaf Min Size : " + leafMinSize, initialX, initialY += 20);
  text("Leaf Max Size : " + leafMaxSize, initialX, initialY += 20);
  text("Variance : " + variation, initialX, initialY += 20);
}

function createPlant() {
  background(51);
  resetMatrix();

  initPropertiesPanel();

  translate(width / 2, height / 1.20);

  for (var i = 0; i < sentence.length; i++) {
    var current = sentence.charAt(i);

    if (current == "F") {
      // stroke(166, 128, 100, 150);
      stroke(branchColor);
      strokeWeight(branchWidth);
      var newLen = branchLength;

      if (prevVariation != variation) {
        var decide = random([true, false]);
        if (decide) {
          newLen = branchLength / variation;
        } else {
          newLen = branchLength * variation;
        }
      }

      line(0, 0, 0, -newLen);
      translate(0, -newLen);
    } else if (current == "+") {
      rotate(radians(angle));
    } else if (current == "-") {
      rotate(-radians(angle));
    } else if (current == "[") {
      push();
    } else if (current == "]") {
      if (leafMinSize != 0 && leafMaxSize != 0) {
        var minSize = min(leafMinSize, leafMaxSize);
        var maxSize = max(leafMinSize, leafMaxSize);

        randX = random(-5, 5);
        randY = random(-15, 15);

        // green leaves
        noStroke();
        // fill(color(100, 200, 0, 255));
        fill(leafColor);
        var leafW = minSize * 0.90 * variation;
        var leafH = maxSize * 0.90 * variation;
        ellipse(0, 0, leafW, leafH);

        // yellow leaves
        // fill(color(255, 255, 0, 155));
        fill(leaf2Color);
        leafW = minSize * 0.90;
        leafH = maxSize * 0.85;
        ellipse(randX, randY, leafW, leafH);

        // purple hue leaves
        var drawRandomPurple = random([true, false]);
        if (drawRandomPurple) {
          // fill(color(255, 0, 255, 150));
          fill(leaf3Color);
          ellipse(-randY, -randX + 20 * variation,
            maxSize * 0.45, minSize * 0.15);
        }
      }

      pop();
    } else if (current == "X") {
      // noop
    }
  }

  prevVariation = variation;
}

function setup() {
  // createCanvas(850, 850);
  createCanvas(windowWidth, windowHeight);

  background(51);

  var parentDiv = createDiv();
  parentDiv.style("border", "1px solid white");
  parentDiv.style("margin", "12px");
  parentDiv.style("padding", "16px");
  parentDiv.style("position", "fixed");
  parentDiv.style("left", "150px");
  parentDiv.style("top", "0px");

  var container = createDiv();
  container.attribute("id", "container");
  createButtons(container);
  createSliders(container);
  container.addClass("hide");

  var collapseBtn = createButton("Toggle Panel");
  collapseBtn.style("margin-bottom", "12px");
  collapseBtn.mousePressed(function() {
    select("#container").toggleClass("hide");
  });
  parentDiv.child(collapseBtn);


  parentDiv.child(container);

  initRules();
  initSeed();

  generate();
  generate();
  generate();
  generate();
}