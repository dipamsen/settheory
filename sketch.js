const u = new M.UniversalSet();
const φ = new M.NullSet();

let a = new M.Set("A"),
  b = new M.Set("B"),
  c = new M.Set("C");
let noSets = 2;

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
  createCanvas(600, (windowHeight * 7) / 10).parent("app");
  strokeWeight(2);
  textAlign(CENTER, CENTER);

  setup2Sets();
  select("input").input(inputChanged);

  selectAll(".sym").forEach((x) =>
    x.mousePressed(function () {
      i = select("input");
      i.value(i.value() + this.html());
      inputChanged();
    })
  );
  noLoop();
}

function draw() {
  background(51);
  sets.forEach((s) => s.draw());
  drawOverlay();
}

function drawOverlay() {
  sets.forEach((s) => s.drawOverlay());
}

function setError(e) {
  select("#error").html(e);
}

function clearScreen() {
  redraw();
}

function inputChanged() {
  let input = select("input").value().trim();
  input = input
    .replace(/v/g, "∪")
    .replace(/\^/g, "∩")
    .replace(/0/g, "φ")
    .toUpperCase();
  input = [...input].map((x) => (!allowedChars.includes(x) ? "" : x)).join("");
  select("input").value(input);
  if (input.length == 0) {
    clearScreen();
    setError("");
    return;
  }
  if (input.includes("C")) {
    if (noSets == 2) setup3Sets();
  } else if (noSets == 3) setup2Sets();

  try {
    const ast = parse(input);
    const output = ast.evaluate(ctx);
    const lOut = ast.left?.evaluate(ctx);
    const rOut = ast.right?.evaluate(ctx);
    const aOut = ast.arg?.evaluate(ctx);
    redraw();
    if (ast.type === "Intersection") {
      highlightAreaByCondition(lOut.includes.bind(lOut), [0, 255, 0, 15]);
      highlightAreaByCondition(rOut.includes.bind(rOut), [0, 0, 255, 15]);
    }
    highlightAreaByCondition(output.includes.bind(output), [255, 0, 0, 90]);
    drawOverlay();
    setError("");
  } catch (e) {
    console.log(e.message);
    ErrorHandler[e.code](e);
  }
}

function setup2Sets() {
  a.setVals(200, 200, 230);
  b.setVals(400, 200, 280);
  noSets = 2;
}

function setup3Sets() {
  a.setVals(200, 160, 230);
  b.setVals(380, 170, 210);
  c.setVals(300, 280, 250);
  noSets = 3;
}

function highlightAreaByCondition(
  isPointedIncluded = () => false,
  color = [250, 50, 0, 50]
) {
  let sz = 2;
  push();
  noFill();
  stroke(color);
  for (let i = 0; i < width / sz; i++) {
    for (let j = 0; j < height / sz; j++) {
      const x = i * sz;
      const y = j * sz;
      if (isPointedIncluded(x, y)) point(x, y);
    }
  }
  pop();
}
