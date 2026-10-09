import { useState, useEffect } from "react";
import { loadModel } from "./model.js";
import PredictRent from "./components/PredictRent.jsx";
import Shortlist from "./components/Shortlist.jsx";
import CompareAreas from "./components/CompareAreas.jsx";
import MarketOverview from "./components/MarketOverview.jsx";

function App() {
  const [model, setModel] = useState(null);       // the model from model.json
  const [page, setPage] = useState("predict");    // which page is open
  const [shortlist, setShortlist] = useState([]); // the saved houses

  // Load the model once, when the website opens
  useEffect(() => {
    loadModel().then((data) => setModel(data));
  }, []);

  function addToShortlist(house) {
    setShortlist([...shortlist, house]);
  }

  function removeFromShortlist(index) {
    setShortlist(shortlist.filter((house, i) => i !== index));
  }

  if (!model) return <p className="loading">Loading the model…</p>;

  return (
    <>
      <header className="header">
        <h1>Houses Rental</h1>
        <p>Rent prediction for Kuala Lumpur &amp; Selangor</p>

        <nav>
          <button className={page === "predict" ? "active" : ""} onClick={() => setPage("predict")}>
            Predict rent
          </button>
          <button className={page === "areas" ? "active" : ""} onClick={() => setPage("areas")}>
            Areas in my budget
          </button>
          <button className={page === "market" ? "active" : ""} onClick={() => setPage("market")}>
            Market overview
          </button>
        </nav>
      </header>

      <main>
        {page === "predict" && (
          <>
            <PredictRent model={model} onSave={addToShortlist} />
            <Shortlist houses={shortlist} onRemove={removeFromShortlist} />
          </>
        )}
        {page === "areas" && <CompareAreas model={model} />}
        {page === "market" && <MarketOverview model={model} />}
      </main>

      <footer>
        Random Forest model trained on {model.market.total_listings.toLocaleString()} listings from mudah.my.
        Average error: about RM {model.mae}.
      </footer>
    </>
  );
}

export default App;
