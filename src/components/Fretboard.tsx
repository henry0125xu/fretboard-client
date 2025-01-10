import { useEffect } from "react";

const Fretboard = () => {
  useEffect(() => {
    document.title = "Fretboard";
  }, []);
  return <h1>Fretboard</h1>;
};

export default Fretboard;
