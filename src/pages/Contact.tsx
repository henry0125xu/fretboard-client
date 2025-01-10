import { useEffect } from "react";

const Contact = () => {
  useEffect(() => {
    document.title = "Contact";
  }, []);
  return <h1>Contact Page</h1>;
};

export default Contact;
