import { rm } from "../model.js";

// Page 3: what the data tells us (the same findings as the EDA in the notebook)

// A simple bar chart. "data" looks like: { "Flat": 800, "Condominium": 1600 }
function BarChart({ data }) {
  const rows = Object.entries(data).sort((a, b) => b[1] - a[1]); // biggest first
  const highest = rows[0][1];

  return rows.map(([name, value]) => (
    <div className="bar-row" key={name}>
      <span>{name}</span>
      <div className="bar-bg">
        <div className="bar" style={{ width: (value / highest) * 100 + "%" }} />
      </div>
      <b>{rm(value)}</b>
    </div>
  ));
}

function MarketOverview({ model }) {
  const market = model.market;

  // Median rent of each area with at least 30 listings
  const areaRent = {};
  for (const name in model.areas) {
    if (model.areas[name].count >= 30) {
      areaRent[name] = model.areas[name].median;
    }
  }

  // Sort the areas from most to least expensive, then take the top 10 and bottom 10
  const sorted = Object.entries(areaRent).sort((a, b) => b[1] - a[1]);
  const mostExpensive = Object.fromEntries(sorted.slice(0, 10));
  const cheapest = Object.fromEntries(sorted.slice(-10));

  return (
    <>
      <div className="stats">
        <div className="card"><p className="big">{market.total_listings.toLocaleString()}</p>listings</div>
        <div className="card"><p className="big">{rm(market.median_rent)}</p>median rent</div>
        <div className="card"><p className="big">{rm(market.by_region["Kuala Lumpur"])}</p>Kuala Lumpur</div>
        <div className="card"><p className="big">{rm(market.by_region["Selangor"])}</p>Selangor</div>
      </div>

      <div className="columns">
        <div className="card">
          <h2>By furnishing</h2>
          <BarChart data={market.by_furnished} />
        </div>
        <div className="card">
          <h2>By property type</h2>
          <BarChart data={market.by_type} />
        </div>
        <div className="card">
          <h2>Most expensive areas</h2>
          <BarChart data={mostExpensive} />
        </div>
        <div className="card">
          <h2>Cheapest areas</h2>
          <BarChart data={cheapest} />
        </div>
      </div>
    </>
  );
}

export default MarketOverview;
