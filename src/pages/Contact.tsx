import { useEffect } from "react";

const Contact = () => {
  useEffect(() => {
    document.title = "Contact";
  }, []);
  return (
    <>
      <h1>Contact Page</h1>
      <p>Reach me at henry0125xu@gmail.com</p>
    </>
  );
};

export default Contact;
