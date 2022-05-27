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
    fill(255);
    noStroke();
    textSize(20);
    text(this.idx, 0, (this.sz + 15) * (this.y < height / 2 ? -1 : 1));
    pop();
  }
};

M.UniversalSet = class UniversalSet extends M.Set {
  mar = 10
  includes(x, y) {
    return x < width - this.mar && y < height - this.mar && x > this.mar && y > this.mar;
  }
  draw() {
    push();
    noFill();
    stroke(255);
    rect(this.mar, this.mar, width - this.mar*2, height - this.mar*2);
    pop();
    push();
    fill(255);
    noStroke();
    textSize(20);
    text("U", this.mar + 15, this.mar +15);
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
