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
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */