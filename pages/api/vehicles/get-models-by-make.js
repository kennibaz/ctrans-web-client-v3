import axios from "axios";

export default async (req, res) => {
  return new Promise(async (resolve) => {
    const { make } = req.body;

    if (!make) {
      return;
    }
    let models;
    try {
      models = await axios.get(
        `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${make}?format=json`
      );
    } catch (error) {
      console.log(error); // Can be a simple console.error too
      res.status(500).end();
      return resolve();
    }
    let list_of_models = models.data.Results.map((model) => {
      return {
        model: model.Model_Name,
      };
    });
    res.status(200).send(list_of_models);
    return resolve();
  });
};
