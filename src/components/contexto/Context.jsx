import { useState } from "react";
import { Children } from "react";
import { createContext } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {


    const [editarTelefono, setEditarTelefono] = useState(false);
    const [editarEmail, setEditarEmail] = useState(false);
    const [editarCuit, setEditarCuit] = useState(false);
    const [editarCbu, setEditarCbu] = useState(false);
    

    return <Context.Provider value={{
        editarTelefono, setEditarTelefono, editarEmail,
        setEditarEmail, editarCuit, setEditarCuit, editarCbu, setEditarCbu
    }}>
        {children}
    </Context.Provider>
}



export default ContextProvider;