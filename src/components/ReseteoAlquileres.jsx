import { collection, doc, getDoc, getDocs, getFirestore, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"


const ReseteoAlquileres = () => {
    let minutoActual = new Date().getMinutes()
    const [fechas, setFechas] = useState([])
    const [inquilinos, setInquilinos] = useState([])


    useEffect(() => {
        const db = getFirestore();
        const itemCollection = collection(db, "inquilinos")
        const docRef = doc(db, "fechas", "fecha")

        getDoc(docRef).then(snapShot => {
            if (snapShot.exists()) {

                setFechas({ id: snapShot.id, ...snapShot.data() });
            } else {
                console.error("error")
            }

        })
        getDocs(itemCollection).then(Snapshot => {

            if (Snapshot.size > 0) {

                setInquilinos(Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() })));


            } else {
                console.error("error")
            }
        })



    }, [])


    if (fechas.minutes != minutoActual) {
        const db = getFirestore();
        const docRef = doc(db, "fechas", "fecha")
        updateDoc(docRef, { minutes: minutoActual }).then(
            inquilinos.map(inquilinos => {
                const doc2 = doc(db, "inquilinos", inquilinos.id)
                updateDoc(doc2, { alquiler: false })
            })
        )


    }





    return (
        <>

            <h1>{fechas.minutes}</h1>

        </>
    )


}

export default ReseteoAlquileres