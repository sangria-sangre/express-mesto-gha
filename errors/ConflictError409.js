class ConflictError409 extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}

module.exports = ConflictError409;