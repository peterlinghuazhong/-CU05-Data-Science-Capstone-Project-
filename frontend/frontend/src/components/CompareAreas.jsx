import { useState } from "react";
import { predictRent, rm } from "../model.js";

// Page 2: choose a house and a budget.
// We predict the rent of that house in every area, and show which areas fit the budget.
function CompareAreas({ model }) {
  const [budget, setBudget] = useState(1500);
  const [house, setHouse] = useState({
    property_type: "Condominium",
    furnished: "Partially Furnished",
    size: 850,
    rooms: 3,
    bathroom: 2,
    parking: 1,
  });

  function handleChange(e) {
    setHouse({ ...house, [e.target.name]: e.target.value });
  }

  // 1. Only areas with at least 30 listings (more reliable)
  const areaNames = Object.keys(model.areas).filter((name) => model.areas[name].count >= 30);

  // 2. Predict the rent of the same house in each area
  const results = areaNames.map((name) => ({
    area: name,
    rent: predictRent(model, { ...house, location: name }),
  }));

  // 3. Sort from cheapest to most expensive
  results.sort((a, b) => a.rent - b.rent);

  // 4. Count how many areas fit the budget
  const fits = results.filter((r) => r.rent <= budget).length;
  const highest = results[results.length - 1].rent;

  return (
    <div className="columns">
      <div className="card">
        <h2>The house you want</h2>

        <label>My budget: {rm(budget)}</label>
        <input type="range" min="500" max="4000" step="50" value={budget} onChange={(e) => setBudget(Number(e.target.value))} />

        <label>Property type</label>
        <select name="property_type" value={house.property_type} onChange={handleChange}>
          {model.property_types.map((type) => <option key={type}>{type}</option>)}
        </select>

        <label>Furnishing</label>
        <select name="furnished" value={house.furnished} onChange={handleChange}>
          {model.furnished.map((f) => <option key={f}>{f}</option>)}
        </select>

        <label>Size (sq.ft.)</label>
        <input type="number" name="size" value={house.size} onChange={handleChange} />

        <label>Rooms</label>
        <input type="number" name="rooms" value={house.rooms} onChange={handleChange} />

        <label>Bathrooms</label>
        <input type="number" name="bathroom" value={house.bathroom} onChange={handleChange} />

        <label>Parking</label>
        <input type="number" name="parking" value={house.parking} onChange={handleChange} />
      </div>

      <div className="card">
        <p className="big">{fits} of {results.length}</p>
        <p className="muted">areas fit your budget (black bars). Grey bars are over your budget.</p>

        {results.map((r) => (
          <div className="bar-row" key={r.area}>
            <span>{r.area}</span>
            <div className="bar-bg">
              <div
                className={r.rent <= budget ? "bar" : "bar grey"}
                style={{ width: (r.rent / highest) * 100 + "%" }}
              />
            </div>
            <b>{rm(r.rent)}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompareAreas;
