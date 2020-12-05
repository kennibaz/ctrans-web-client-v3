import axios from "axios";

export default async (req, res) => {
    const { make } = req.body;
    console.log(make)
    if (!make) {
      return;
    }
    let models;
    try {
      models = await axios.get(
        `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${make}?format=json`
      );
    } catch (error) {
      console.log(error);
    }
    let list_of_models = models.data.Results.map((model) => {
      return {
        model: model.Model_Name,
      };
    });
    res.send(list_of_models);
};
