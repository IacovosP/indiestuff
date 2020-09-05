
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
const formidable = require('formidable');
const util = require('util');

export default class UploadController {

static track = async (req: Request, res: Response) => {
  // Instantiate a new formidable form for processing.

  var form = new formidable.IncomingForm();

  // form.parse analyzes the incoming stream data, picking apart the different fields and files for you.

  form.parse(req, function(err, fields, files) {
    if (err) {

        // Check for and handle any errors here.
        console.error(err.message);
        return;
    }
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    // This last line responds to the form submission with a list of the parsed data and files.
    res.end(util.inspect({fields: fields, files: files}));
  });
  return;
};

}