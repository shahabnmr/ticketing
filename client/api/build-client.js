import axios from "axios";

const buildClient = ({ req }) => {
  // ba estefade az req etelaati ke dar header browser hast ro ba estefade az server mifrestim ke shamel cookie ham mishe

  if (typeof window === "undefined") {
    //we are on the server
    // requests should be made to http://ingress-nginx.ingress-nginx
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    //we are on the browser
    // request can be made with a base url of ''

    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClient;
