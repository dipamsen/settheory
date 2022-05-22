const Errors = {
  // Error codes
  UNEXPECTED_CHARACTER: "UNEXPECTED_CHARACTER",
  UNEXPECTED_END: "UNEXPECTED_END",
  EXPECTED_CHARACTER: "EXPECTED_CHARACTER",
};

const ErrorHandler = {
  UNEXPECTED_CHARACTER({ code, message, char, pos }) {
    const highlightTxt = select("input")
      .value()
      .split("")
      .map((x, i) => (i === pos ? `<mark>${x}</mark>` : x))
      .join("");
    setError(message + "<br><span>" + highlightTxt + "</span>");
  },
  UNEXPECTED_END({ code, message, pos }) {
    setError(message);
  },
  EXPECTED_CHARACTER({ code, message, char, pos }) {
    const highlightTxt = select("input").value().split();
    highlightTxt.splice(pos, 0, `<mark>${char}</mark>`);

    setError(message + "<br><span>" + highlightTxt.join("") + "</span>");
  },
};

class CustomError extends Error {
  constructor(args) {
    super(args.msg);
    this.code = args.code;
    this.char = args.char;
    this.pos = args.pos;
  }
}
