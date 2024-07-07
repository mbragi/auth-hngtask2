import serverResponseStatus from "../constants/serverResponseStatus.constant";

interface response {
    response: any;
    message: string
}

class ResponseUtils {
    public buildResponse({response, message}: response) {
      return {
        status: "success",
        message: message,
        // statusCode: 201,
        data: {...response},
      };
    }

}

export default new ResponseUtils()