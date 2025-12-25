import {
  BrowserRouter as Router,
  RouterProvider,
} from "react-router-dom";
import router from "./Routes/Route";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AppRoute from "./Routes/Route";



function App() {

  return (
     <LocalizationProvider dateAdapter={AdapterDayjs}>

      <AppRoute/>
     </LocalizationProvider>

  );
}
export default App;
