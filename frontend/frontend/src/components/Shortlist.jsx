import { rm } from "../model.js";

// The houses the user saved, so they can compare them
function Shortlist({ houses, onRemove }) {
  return (
    <div className="card">
      <h2>My shortlist</h2>

      {houses.length === 0 && <p className="muted">Click "Save to shortlist" to compare houses here.</p>}

      {houses.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Area</th>
              <th>Type</th>
              <th>Size</th>
              <th>Predicted</th>
              <th>Asking</th>
              <th>Verdict</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {houses.map((house, i) => (
              <tr key={i}>
                <td>{house.location}</td>
                <td>{house.property_type}</td>
                <td>{house.size} sq.ft.</td>
                <td><b>{rm(house.predicted)}</b></td>
                <td>{house.asking === "" ? "–" : rm(house.asking)}</td>
                <td>{house.verdict === null ? "–" : house.verdict.label}</td>
                <td><button className="link" onClick={() => onRemove(i)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Shortlist;
