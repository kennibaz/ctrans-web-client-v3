import axios from "axios";

export default async (req, res) => {
  return new Promise(async (resolve) => {
    const { placeId } = req.body;
    let  postal_code, city, state
    if (placeId) {
      try {
        let respond = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=AIzaSyCYhmug_bUhafqhlnoM_8GIHRcFz_iel4c&libraries=places`,
          {}
        );
        let address_components = respond.data.result.address_components;

        postal_code = address_components.filter((component) => {
          return component.types[0] === "postal_code";
        });
        city = address_components.filter((component) => {
          return component.types[0] === "locality";
        });
        state = address_components.filter((component) => {
          return component.types[0] === "administrative_area_level_1";
        });
      } catch (error) {
        console.log(error); // Can be a simple console.error too
        res.status(500).end();
        return resolve();
      }
      res.status(200).send({
        zip: postal_code[0].long_name,
        city: city[0].long_name,
        state: state[0].long_name,
      });
      return resolve();
    }
  });
};
