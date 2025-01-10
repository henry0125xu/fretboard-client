import { useState, useEffect } from "react";
import axios from "axios";
import fretboardStringifier from "../utils/fretboardStringifier";

// Example API endpoint (adjust as needed)
const GET_FRETBOARD_API = "http://localhost:8000/api/fretboard";
const RESET_FRETBOARD_API = "http://localhost:8000/api/fretboard/reset";
const PRESS_NOTES_API = "http://localhost:8000/api/fretboard/press-notes";

const Home = () => {
  // State to store the fretboard data
  const [fretboard, setFretboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");

  // Fetch fretboard data on initial load
  useEffect(() => {
    // Make an API call to fetch the fretboard data when the component mounts
    const fetchFretboard = async () => {
      try {
        const response = await axios.get(GET_FRETBOARD_API);
        setFretboard(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching fretboard data:", error);
        setLoading(false);
      }
    };

    fetchFretboard();
  }, []);

  const convertCsvToArray = (csv: string): string[] => {
    return csv.split(",").map((item) => item.trim());
  };

  const resetFretboard = async () => {
    try {
      const response = await axios.post(RESET_FRETBOARD_API);
      setFretboard(response.data);
    } catch (error) {
      console.error("Error updating fretboard:", error);
    }
  };

  const pressNotes = async () => {
    if (!notes) return;

    const noteArray = convertCsvToArray(notes);

    try {
      const response = await axios.post(PRESS_NOTES_API, { notes: noteArray });
      // Update the state with the updated fretboard
      setFretboard(response.data);
    } catch (error) {
      console.error("Error updating fretboard:", error);
    }
  };

  // Render the fretboard
  const renderFretboard = () => {
    if (!fretboard) return <div>No fretboard data available.</div>;

    return (
      <div>
        <h3>Fretboard</h3>
        {/* Render fretboard based on your data */}
        {/* <pre>{JSON.stringify(fretboard, null, 2)}</pre> */}
        {fretboardStringifier(fretboard)}
      </div>
    );
  };

  return (
    <div className="home-page">
      {loading ? <p>Loading fretboard data...</p> : renderFretboard()}

      {/* Button to update fretboard */}
      <br />
      <div style={{ marginTop: 15 }}>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (separated by ',')"
        />
        <button onClick={pressNotes}>Press Notes</button>
      </div>
      <br />
      <button onClick={resetFretboard} style={{ marginTop: 15 }}>
        Reset
      </button>
      <br />
    </div>
  );
};

export default Home;
