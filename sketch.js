const u = new M.UniversalSet();
const φ = new M.NullSet();

let a = new M.Set("A"),
  b = new M.Set("B"),
  c = new M.Set("C");
let noSets = 2;

let inputBox

const allowedChars = ["A", "B", "C", "φ", "U", "-", "∪", "∩", "(", ")", "'"];

const ctx = {
  U: u,
  A: a,
  B: b,
  C: c,
  φ,
};

const sets = Object.values(ctx);

function setup() {
  createCanvas(min(600, windowWidth), (min(600,windowWidth) * 7) / 10).parent("app");
  strokeWeight(2);
  textAlign(CENTER, CENTER);

  setup2Sets();
  inputBox = select("input")
  
  inputBox.input(inputChanged);
  noLoop();
}

function draw() {
  background(51);
  drawOverlay();
}

function drawOverlay() {
  sets.forEach((s) => s.draw());
}

function setError(e) {
  select("#error").html(e);
}

function clearScreen() {
  redraw();
}

function inputChanged() {
  let val = inputBox.value().trim();
  val = val
    .replace(/v/g, "∪")
    .replace(/\^/g, "∩")
    .toUpperCase()
    .replace(/[0Φ]/g, "φ");
  val = [...val].map((x) => (!allowedChars.includes(x) ? "" : x)).join("");
  inputBox.value(val);
}

function setup2Sets() {
  a.setVals(width/3, width/3, width*230/600);
  b.setVals(width*2/3, width/3, width*280/600);
  noSets = 2;
}

function setup3Sets() {
  a.setVals(width/3, width*160/600, width*230/600);
  b.setVals(width*380/600, width*170/600, width*210/600);
  c.setVals(width*300/600, width*280/600, width*250/600);
  noSets = 3;
}

function highlightAreaByCondition(
  isPointedIncluded = () => false,
  color = [250, 50, 0, 50]
) {
  let sz = 5;
  push();
  noStroke();
  fill(color);
  for (let i = 0; i < width / sz; i++) {
    for (let j = 0; j < height / sz; j++) {
      const x = i * sz;
      const y = j * sz;
      if (isPointedIncluded(x, y)) square(x - sz/2, y -sz/2, sz);
    }
  }
  pop();
}

function createOutput() {
  const input = inputBox.value()

  if (input.length == 0) {
    clearScreen();
    setError("");
    return;
  }
  // DO the Thing
  if (input.includes("C")) {
    if (noSets == 2) setup3Sets();
  } else if (noSets == 3) setup2Sets();

  try {
    const ast = parse(input);
    const output = ast.evaluate(ctx);
    // const lOut = ast.left?.evaluate(ctx);
    // const rOut = ast.right?.evaluate(ctx);
    // const aOut = ast.arg?.evaluate(ctx);
    redraw();
    // if (ast.type === "Intersection") {
    //   highlightAreaByCondition(lOut.includes.bind(lOut), [0, 255, 0, 15]);
    //   highlightAreaByCondition(rOut.includes.bind(rOut), [0, 0, 255, 15]);
    // }
    highlightAreaByCondition(output.includes.bind(output), [255, 0, 0, 90]);
    drawOverlay();
    setError("");
  } catch (e) {
    console.log(e.message);
    ErrorHandler[e.code](e);
  }
}
