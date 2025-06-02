interface Fret {
  midiNoteNumber: number;
  pitchClass: number;
  enharmonicNotes: string[];
  frequency: number;
  isPressed: boolean;
}

interface String {
  frets: Fret[];
}

interface Fretboard {
  strings: String[];
}

interface FretboardData {
  fretboard: Fretboard;
}

type FretSummary = {
  enharmonicNotes: string[];
  isPressed: boolean;
};

const toFretboard2d = (fretboardData: FretboardData): FretSummary[][] => {
  const fretboard2D: FretSummary[][] = fretboardData.fretboard.strings.map(
    (string) =>
      string.frets.map((fret) => ({
        enharmonicNotes: fret.enharmonicNotes,
        isPressed: fret.isPressed,
      }))
  );

  return fretboard2D;
};

const printArray = (values: string[], length: number): string => {
  if (values.length === 1) {
    const padding = Math.max(0, (length - values[0].length) / 2); // Calculate padding
    return values[0]
      .padStart(values[0].length + Math.floor(padding))
      .padEnd(length); // Pad both sides
  } else if (values.length === 2) {
    // Handle the two values: pad both sides and join with '/'
    const padding1 = Math.max(0, (length - values[0].length) / 2);
    const padding2 = Math.max(0, (length - values[1].length) / 2);
    return `${values[0]
      .padStart(values[0].length + Math.floor(padding1))
      .padEnd(length)} / ${values[1]
      .padStart(values[1].length + Math.floor(padding2))
      .padEnd(length)}`;
  } else {
    throw new Error("Array must have 1 or 2 elements");
  }
};

const getColumnColor = (colIndex: number): string => {
  if (colIndex === 0) {
    return "salmon";
  } else if ([3, 5, 7, 9, 12, 15, 17].includes(colIndex)) {
    return colIndex === 12 ? "blue" : "orange";
  } else {
    return "black";
  }
};

const getFretboardRowLayout = (
  fretboard2D: FretSummary[][],
  row: FretSummary[],
  rowIndex: number
) => (
  <div
    key={rowIndex}
    style={{
      display: "flex",
      gap: "3px",
      borderBottom:
        rowIndex < fretboard2D.length - 1 ? "1px solid black" : undefined,
    }}
  >
    {row.map((cell, colIndex) => (
      <div
        key={colIndex}
        style={{
          width: "64px",
          fontSize: "15px",
          padding: "1px",
          borderRight:
            colIndex < row.length - 1 ? "1px solid black" : undefined,
          backgroundColor: cell.isPressed
            ? colIndex === 0
              ? "lightblue"
              : "yellow"
            : "white",
          textAlign: "center",
        }}
      >
        <text style={{ color: getColumnColor(colIndex) }}>
          {printArray(cell.enharmonicNotes, 7)}
        </text>
      </div>
    ))}
  </div>
);

const getFretboardLayout = (
  colHeader: number[],
  fretboard2D: FretSummary[][]
) => (
  <div>
    <div
      style={{
        display: "flex",
        gap: "3px",
      }}
    >
      {colHeader.map((cell, colIndex) => (
        <div
          key={colIndex}
          style={{
            width: "64px",
            fontSize: "15px",
            padding: "1.5px",
            textAlign: "center",
          }}
        >
          <text
            style={{
              color: getColumnColor(colIndex),
            }}
          >
            {cell}
          </text>
        </div>
      ))}
    </div>

    <div
      style={{
        display: "flex",
        overflowY: "auto",
        flexDirection: "column",
        gap: "1px",
        border: "1px solid black",
      }}
    >
      {fretboard2D.map((row, rowIndex) =>
        getFretboardRowLayout(fretboard2D, row, rowIndex)
      )}
    </div>
  </div>
);

const fretboardStringtifier = (fretboard: FretboardData | null) => {
  if (!fretboard) {
    console.error("Fretboard data is null or undefined.");
    return;
  }

  try {
    const fretboard2D = toFretboard2d(fretboard);

    const colHeader: number[] = Array.from(
      { length: fretboard2D[0].length },
      (_, index) => index
    );

    const rowHeader: number[] = Array.from(
      { length: fretboard2D.length },
      (_, index) => index
    );

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            marginRight: "10px",
            marginTop: "22px",
            gap: "1px",
          }}
        >
          {rowHeader.map((_, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                fontSize: "15px",
                padding: "1px",
                textAlign: "center",
              }}
            >
              {rowIndex}
            </div>
          ))}
        </div>
        {getFretboardLayout(colHeader, fretboard2D)}
      </div>
    );
  } catch (error) {
    console.error("Error processing fretboard object:", error);
  }
};

export default fretboardStringtifier;
