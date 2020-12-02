import { Grid } from "@material-ui/core";


export default function Home() {
  return (
    <Grid container direction="column">
      <Grid item></Grid>
      <Grid item container>
        <Grid xs={0} sm={2}/>
        <Grid xs={12} sm={8}>
       
        </Grid>
        <Grid xs={0} sm={2}/>
      </Grid>
    </Grid>
  );
}
