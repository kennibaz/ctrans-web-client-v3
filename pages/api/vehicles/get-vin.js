import axios from "axios";

export default async (req, res) => {
  const { vin } = req.body;
  let result;
  try {
    result = await axios.get(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`,
      {}
    );
  } catch (err) {
    console.log(err);
  }
  res.json(result.data.Results[0]);
};
