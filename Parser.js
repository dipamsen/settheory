class Lexer {
  constructor(input) {
    this.input = input;
    this.pos = 0;
  }
  get currentChar() {
    return this.input[this.pos];
  }
  nextChar() {
    this.pos++;
    if (this.currentChar === " ") {
      this.nextChar();
    }
  }
  parseExpression() {
    let a = this.parseTerm();
    while (true) {
      if (this.currentChar === "∪") {
        this.nextChar();
        let b = this.parseTerm();
        a = new Union(a, b);
      } else if (this.currentChar === "∩") {
        this.nextChar();
        let b = this.parseTerm();
        a = new Intersection(a, b);
      } else if (this.currentChar === "-") {
        this.nextChar();
        let b = this.parseTerm();
        a = new Difference(a, b);
      } else {
        return a;
      }
    }
  }
  parseTerm() {
    if (this.isID(this.currentChar)) {
      let a = new Identifier(this.currentChar);
      this.nextChar();
      if (this.currentChar === "'") {
        this.nextChar();
        return new Complement(a);
      }
      return a;
    } else if (this.currentChar === "(") {
      this.nextChar();
      const a = this.parseExpression();
      if (this.currentChar === ")") {
        this.nextChar();
        if (this.currentChar === "'") {
          this.nextChar();
          return new Complement(a);
        }
        return a;
      } else {
        throw new CustomError({
          code: Errors.EXPECTED_CHARACTER,
          msg: "Expected ')'",
          char: ")",
          pos: this.pos,
        });
      }
    } else {
      throw new CustomError(
        this.currentChar == null
          ? {
              code: Errors.UNEXPECTED_END,
              msg: "Input ended unexpectedly",
            }
          : {
              code: Errors.UNEXPECTED_CHARACTER,
              msg: "Unexpected character '" + this.currentChar + "'",
              char: this.currentChar,
              pos: this.pos,
            }
      );
    }
  }
  isID(token) {
    return ["A", "B", "C", "φ", "U"].includes(token);
  }
  tokenize() {
    const resultTree = this.parseExpression();

    if (this.currentChar) {
      throw new CustomError({
        code: Errors.UNEXPECTED_CHARACTER,
        msg: "Unexpected character '" + this.currentChar + "'",
        char: this.currentChar,
        pos: this.pos,
      });
    }
    return resultTree;
  }
}

class TreeNode {}
class Union extends TreeNode {
  type = "Union";
  constructor(a, b) {
    super();
    this.left = a;
    this.right = b;
  }
  evaluate(context) {
    return M.Set.prototype.union.call(
      this.left.evaluate(context),
      this.right.evaluate(context)
    );
  }
  toString() {
    return `(${this.left} + ${this.right})`;
  }
}
class Intersection extends TreeNode {
  type = "Intersection";
  constructor(a, b) {
    super();
    this.left = a;
    this.right = b;
  }
  evaluate(context) {
    return M.Set.prototype.intersection.call(
      this.left.evaluate(context),
      this.right.evaluate(context)
    );
  }
  toString() {
    return `(${this.left} x ${this.right})`;
  }
}
class Difference extends TreeNode {
  type = "Difference";
  constructor(a, b) {
    super();
    this.left = a;
    this.right = b;
  }
  evaluate(context) {
    return M.Set.prototype.difference.call(
      this.left.evaluate(context),
      this.right.evaluate(context)
    );
  }
  toString() {
    return `(${this.left} - ${this.right})`;
  }
}
class Complement extends TreeNode {
  type = "Complement";
  constructor(a) {
    super();
    this.arg = a;
  }
  evaluate(context) {
    return context.U.difference(this.arg.evaluate(context));
  }
  toString() {
    return `(~${this.arg})`;
  }
}
class Identifier extends TreeNode {
  type = "Identifier";
  constructor(name) {
    super();
    this.name = name;
  }
  evaluate(context) {
    return context[this.name];
  }
  toString() {
    return this.name;
  }
}

function parse(input) {
  const lexer = new Lexer(input);
  return lexer.tokenize();
}
