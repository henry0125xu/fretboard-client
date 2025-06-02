import { useEffect } from "react";

const Contact = () => {
  useEffect(() => {
    document.title = "Contact";
  }, []);
  return (
    <>
      <h1>Contact Page</h1>
      <p>You can reach us at contact@example.com</p>
    </>
  );
};

export default Contact;
