// model.js – loads the model and makes predictions.
// The model was trained in the notebook (Step 10) and saved as public/model.json.

// 1. Load model.json
export async function loadModel() {
  const res = await fetch("/model.json");
  return res.json();
}

// 2. One tree: answer yes/no questions until we reach the end (a leaf)
function predictTree(tree, x) {
  let node = 0;
  while (tree.left[node] !== -1) {
    if (x[tree.feature[node]] <= tree.threshold[node]) {
      node = tree.left[node];
    } else {
      node = tree.right[node];
    }
  }
  return tree.value[node];
}

// 3. Random Forest: the average answer of all the trees
export function predictRent(model, unit) {
  const region = model.areas[unit.location].region;

  // Same as pd.get_dummies in Python: chosen options = 1, everything else = 0
  const values = {
    rooms: Number(unit.rooms),
    parking: Number(unit.parking),
    bathroom: Number(unit.bathroom),
    size: Number(unit.size),
    ["location_" + unit.location]: 1,
    ["property_type_" + unit.property_type]: 1,
    ["furnished_" + unit.furnished]: 1,
    ["region_" + region]: 1,
  };
  const x = model.columns.map((col) => values[col] || 0);

  let total = 0;
  for (const tree of model.trees) {
    total += predictTree(tree, x);
  }
  return total / model.trees.length;
}

// 4. Compare the asking rent with the fair rent.
//    Inside fair rent ± MAE (the model's average error) = Fair price.
export function getVerdict(asking, fair, mae) {
  const diff = asking - fair;
  if (diff > mae) return { type: "over", label: "Overpriced", diff };
  if (diff < -mae) return { type: "good", label: "Good deal", diff };
  return { type: "fair", label: "Fair price", diff };
}

// 5. Show money nicely: 1584.3 -> "RM 1,584"
export function rm(n) {
  return "RM " + Math.round(n).toLocaleString();
}
