import { useState } from "react";
import { predictRent, getVerdict, rm } from "../model.js";

// Page 1: enter the house details -> get the predicted rent.
// Optional: enter the asking rent of a listing -> see if it is fair.
function PredictRent({ model, onSave }) {
  const [form, setForm] = useState({
    location: "Setapak",
    property_type: "Condominium",
    furnished: "Partially Furnished",
    size: 900,
    rooms: 3,
    bathroom: 2,
    parking: 1,
    asking: "",
  });
  const [result, setResult] = useState(null);

  // Update the form when the user types or chooses something
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // When the user clicks "Predict rent"
  function handlePredict(e) {
    e.preventDefault();
    const predicted = predictRent(model, form);

    let verdict = null;
    if (form.asking !== "") {
      verdict = getVerdict(Number(form.asking), predicted, model.mae);
    }

    setResult({ ...form, predicted: predicted, verdict: verdict });
  }

  return (
    <div className="columns">
      {/* LEFT: the form */}
      <form className="card" onSubmit={handlePredict}>
        <h2>House details</h2>

        <label>Area</label>
        <select name="location" value={form.location} onChange={handleChange}>
          {Object.keys(model.areas).map((area) => <option key={area}>{area}</option>)}
        </select>

        <label>Property type</label>
        <select name="property_type" value={form.property_type} onChange={handleChange}>
          {model.property_types.map((type) => <option key={type}>{type}</option>)}
        </select>

        <label>Furnishing</label>
        <select name="furnished" value={form.furnished} onChange={handleChange}>
          {model.furnished.map((f) => <option key={f}>{f}</option>)}
        </select>

        <label>Size (sq.ft.)</label>
        <input type="number" name="size" value={form.size} onChange={handleChange} />

        <label>Rooms</label>
        <input type="number" name="rooms" value={form.rooms} onChange={handleChange} />

        <label>Bathrooms</label>
        <input type="number" name="bathroom" value={form.bathroom} onChange={handleChange} />

        <label>Parking</label>
        <input type="number" name="parking" value={form.parking} onChange={handleChange} />

        <label>Asking rent in RM (optional)</label>
        <input type="number" name="asking" value={form.asking} onChange={handleChange} placeholder="e.g. 1800" />

        <button>Predict rent</button>
      </form>

      {/* RIGHT: the result */}
      <div className="card">
        {result === null && <p className="muted">Fill in the house details and click "Predict rent".</p>}

        {result !== null && (
          <>
            <p className="muted">Predicted monthly rent</p>
            <p className="big">{rm(result.predicted)}</p>
            <p className="muted">
              Most similar houses: {rm(result.predicted - model.mae)} – {rm(result.predicted + model.mae)}
            </p>

            {/* Only shown if the user typed an asking rent */}
            {result.verdict !== null && (
              <div className="verdict">
                <p className="badge">{result.verdict.label}</p>
                <p>Asking rent: {rm(result.asking)}</p>
                {result.verdict.type === "over" && <p>Try to offer around {rm(result.predicted)}.</p>}
                {result.verdict.type === "fair" && <p>The price is normal. You can still ask for a small discount.</p>}
                {result.verdict.type === "good" && <p>Cheaper than similar houses. Visit it soon.</p>}
              </div>
            )}

            <h3>Rent with other furnishing</h3>
            {model.furnished.map((f) => (
              <p className="row" key={f}>
                <span>{f}</span>
                <b>{rm(predictRent(model, { ...result, furnished: f }))}</b>
              </p>
            ))}

            <button className="outline" onClick={() => onSave(result)}>Save to shortlist</button>
          </>
        )}
      </div>
    </div>
  );
}

export default PredictRent;
