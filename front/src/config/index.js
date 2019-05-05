const config = {
  development: {
    protocol: "http",
    host: "localhost",
    port: "5000"
  }
  /* production: {
      protocol: "http",
      host: process.env.REACT_APP_PROD_HOST || "35.228.5.8",
      port: "80"
    } */
};

export default function(type) {
  return config[type];
}
