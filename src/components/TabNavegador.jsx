import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import MonetizationOnSharpIcon from '@mui/icons-material/MonetizationOnSharp';
import ReceiptLongSharpIcon from '@mui/icons-material/ReceiptLongSharp';
import SpeakerNotesSharpIcon from '@mui/icons-material/SpeakerNotesSharp';
import Person4SharpIcon from '@mui/icons-material/Person4Sharp';
import { Link } from 'react-router-dom';


const TabNavegador = () => {

    return(
      <>

      <div className="tab-navegador">
         <ul className="lista-tab-navegador">
           <Link to={"/propietarios"} className='ancho-icono'>
           <li className="item-tab-navegador">
            <PersonSharpIcon className='text-white' sx={{ fontSize: 40 }}></PersonSharpIcon>
            <p className='nombre-boton'>Propietarios</p>
            </li>
            </Link> 
           <Link to={"/inquilinos"} className='ancho-icono'>
           <li className="item-tab-navegador">
            <Person4SharpIcon className='text-white' sx={{ fontSize: 40 }}></Person4SharpIcon>
            <p className='nombre-boton'>Inquilinos</p>
            </li></Link> 
           <Link to={"/alquileres"} className='ancho-icono'><li className="item-tab-navegador">
            <MonetizationOnSharpIcon className='text-white' sx={{ fontSize: 40 }}></MonetizationOnSharpIcon>
            <p className='nombre-boton'>Aquileres</p>
            </li></Link> 
           <Link to={"/recibos"} className='ancho-icono'><li className="item-tab-navegador">
            <ReceiptLongSharpIcon className='text-white' sx={{ fontSize: 40 }}></ReceiptLongSharpIcon>
            <p className='nombre-boton'>Recibos</p>
            </li></Link> 
           <Link to={"/notas"} className='ancho-icono'><li className="item-tab-navegador">
            <SpeakerNotesSharpIcon className='text-white' sx={{ fontSize: 40 }}></SpeakerNotesSharpIcon>
            <p className='nombre-boton'>Notas</p>
            </li></Link> 
         </ul>
      </div>
      </>
    )
}

export default TabNavegador