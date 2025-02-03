import post from "../functions/post";

interface ErrorType {
  message: string;
  stack?: string;
  name?: string;
  code?: number;
  status?: string;
}

export default function error(error: ErrorType) {
  try {
    if (false) { }

    else
      console.log(error);

  } catch (e) {
    post("Error logger to discord webhook have bug!!", "E", "red", "red");
    console.log(e);
    post("Main Error:", "E", "red", "red");
    console.log(error);
  }
}
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */