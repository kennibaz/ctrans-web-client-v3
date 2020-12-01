import { Grid } from "@material-ui/core";
import Header from "../components/Header"
import Content from "../components/Content"

export default function Home() {
  return (
    <Grid container direction="column">
      <Grid item><Header/></Grid>
      <Grid item container>
        <Grid xs={0} sm={2}/>
        <Grid xs={12} sm={8}>
        <Content/>
        </Grid>
        <Grid xs={0} sm={2}/>
      </Grid>
    </Grid>
  );
}
