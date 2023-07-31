const STATUS_CODE = {
  success: 200,
  successCreate: 201,
  dataError: 400,
  notFound: 404,
  serverError: 500,
};

class NotFound extends Error {
  constructor() {
    super();
    this.name = this.constructor.name;
  }
}

module.exports = STATUS_CODE;
module.exports = NotFound;
