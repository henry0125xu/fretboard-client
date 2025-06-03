import { useState, useEffect } from "react";
import axios from "axios";
import fretboardStringifier from "../utils/fretboardStringifier";

// Example API endpoint (adjust as needed)
const API_ROOT = "https://fretboard-server.onrender.com/api/";
const AUTH_ROOT = "https://fretboard-server.onrender.com/auth/";

const GET_FRETBOARD_API = `${API_ROOT}fretboard`;
const RESET_FRETBOARD_API = `${API_ROOT}fretboard/reset`;
const PRESS_NOTES_API = `${API_ROOT}fretboard/press-notes`;
const UPDATE_OPEN_STRING_API = (stringId: string) =>
  `${API_ROOT}fretboard/strings/${stringId}/open-string`;

const Home = () => {
  const [fretboard, setFretboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [stringId, setStringId] = useState("");
  const [openString, setOpenString] = useState("");

  // Fetch fretboard data on initial load
  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch(`${AUTH_ROOT}jwt/get-token`);
        const data = await response.json();
        if (data.token) {
          sessionStorage.setItem("jwt", data.token);
        }
      } catch (error) {
        console.error("Failed to get JWT:", error);
        return <h1>404 Not Found</h1>;
      }
    };

    const fetchFretboard = async () => {
      try {
        const token = sessionStorage.getItem("jwt");
        const response = await axios.get(GET_FRETBOARD_API, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFretboard(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching fretboard data:", error);
        setLoading(false);
      }
    };

    getToken().then(() => fetchFretboard());
  }, []);

  const convertCsvToArray = (csv: string): string[] => {
    return csv.split(",").map((item) => item.trim());
  };

  const resetFretboard = async () => {
    try {
      const token = sessionStorage.getItem("jwt");
      const response = await axios.post(RESET_FRETBOARD_API, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFretboard(response.data);
    } catch (error) {
      console.error("Error updating fretboard:", error);
    }
  };

  const pressNotes = async () => {
    if (!notes) return;

    const noteArray = convertCsvToArray(notes);

    try {
      const token = sessionStorage.getItem("jwt");
      const response = await axios.post(
        PRESS_NOTES_API,
        { notes: noteArray },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFretboard(response.data);
    } catch (error) {
      console.error("Error updating fretboard:", error);
    }
  };

  const updateOpenString = async () => {
    if (!stringId || !openString) return;

    try {
      const token = sessionStorage.getItem("jwt");
      const response = await axios.put(
        UPDATE_OPEN_STRING_API(stringId),
        {
          openString: openString,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFretboard(response.data);
    } catch (error) {
      console.error("Error updating fretboard:", error);
    }
  };

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
      <div style={{ marginTop: 15 }}>
        <input
          type="text"
          value={stringId}
          onChange={(e) => setStringId(e.target.value)}
          placeholder="String ID"
          style={{ width: "60px" }}
        />
        <input
          type="text"
          value={openString}
          onChange={(e) => setOpenString(e.target.value)}
          placeholder="Open String"
          style={{ width: "80px" }}
        />
        <button onClick={updateOpenString}>Update Open String</button>
      </div>
    </div>
  );
};

export default Home;
