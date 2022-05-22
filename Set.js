const M = {};

M.Set = class Set {
  constructor(idx) {
    this.idx = idx;
  }
  setVals(x, y, sz) {
    this.x = x;
    this.y = y;
    this.sz = sz / 2;
  }
  includes(x, y) {
    return (x - this.x) ** 2 + (y - this.y) ** 2 < this.sz ** 2;
  }
  difference(other) {
    if (this && other)
      return {
        includes: (x, y) => {
          return this.includes(x, y) && !other.includes(x, y);
        },
      };
  }
  union(other) {
    if (this && other)
      return {
        includes: (x, y) => {
          return this.includes(x, y) || other.includes(x, y);
        },
      };
  }
  intersection(other) {
    if (this && other)
      return {
        includes: (x, y) => {
          return this.includes(x, y) && other.includes(x, y);
        },
      };
  }
  draw() {
    if (this.x === undefined || this.y === undefined || this.sz === undefined)
      return;
    push();
    translate(this.x, this.y);
    noFill();
    stroke(255);
    circle(0, 0, this.sz * 2);
    pop();
  }
  drawOverlay() {
    if (this.x === undefined || this.y === undefined || this.sz === undefined)
      return;
    push();
    translate(this.x, this.y);
    fill(255);
    noStroke();
    textSize(20);
    text(this.idx, 0, (this.sz + 15) * (this.y < height / 2 ? -1 : 1));
    pop();
  }
};

M.UniversalSet = class UniversalSet extends M.Set {
  includes(x, y) {
    return x < width - 20 && y < height - 20 && x > 20 && y > 20;
  }
  draw() {
    push();
    noFill();
    stroke(255);
    rect(20, 20, width - 40, height - 40);
    pop();
  }
  drawOverlay() {
    push();
    fill(255);
    noStroke();
    textSize(20);
    text("U", 35, 35);
    pop();
  }
};

M.NullSet = class NullSet extends M.Set {
  includes(x, y) {
    return false;
  }
  draw() {}
  drawOverlay() {}
};
