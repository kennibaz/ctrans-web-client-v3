import React from "react";
import CoffeeCard from "./CoffeCard";
import { Grid } from "@material-ui/core";

export default function Content() {
  return (
    <div>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}><CoffeeCard /></Grid>
      </Grid>
      
    </div>
  );
}
