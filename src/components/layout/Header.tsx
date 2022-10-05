import AppBar from "@mui/material/AppBar/AppBar";
import Toolbar from "@mui/material/Toolbar/Toolbar";
import Typography from "@mui/material/Typography/Typography";

interface IHeaderProps {
  title: string;
};

export default function Header ({title}: IHeaderProps) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" 
          component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}