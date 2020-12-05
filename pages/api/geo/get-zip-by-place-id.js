import axios from "axios";

export default async (req, res) => {
  const { placeId } = req.body;
  let respond;
  if (placeId) {
    try {
      respond = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=AIzaSyCYhmug_bUhafqhlnoM_8GIHRcFz_iel4c&libraries=places`,
        {}
      );
      let address_components = respond.data.result.address_components;

      let postal_code = address_components.filter((component) => {
        return component.types[0] === "postal_code";
      });
      let city = address_components.filter((component) => {
        return component.types[0] === "locality";
      });
      let state = address_components.filter((component) => {
        return component.types[0] === "administrative_area_level_1";
      });
      res.json(
        {
          zip: postal_code[0].long_name,
          city: city[0].long_name,
          state: state[0].long_name
        });
    } catch (err) {
      console.log(err);
    }
  }
};
