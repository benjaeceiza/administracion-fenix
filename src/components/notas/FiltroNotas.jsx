import { collection, getDocs, getFirestore } from "firebase/firestore"


const FiltroNotas = ({ notas, setNotas,setCargando }) => {

    const filtrarNotas = (e) => {
        setCargando(true)

        const db = getFirestore()
        const itemCollection = collection(db, "notas")
        getDocs(itemCollection).then(Snapshot => {
          
            if (Snapshot.size > 0) {

                let notasPrev = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
                notasPrev = [...notasPrev].sort((a, b) => (a.fecha.seconds < b.fecha.seconds ? 1 : a.fecha.seconds > b.fecha.seconds ? -1 : 0))

                if(e.target.value == "all"){
                    setNotas(notasPrev)
                    setCargando(false)
                }else{

                    setNotas(notasPrev.filter(notas => new Date(notas.fecha.seconds * 1000).getMonth() == e.target.value))
                    setCargando(false)
                } 
    
            } else {
                console.error("error")
            }
        })


    }



    return (
        <>

            <div className="filtro-notas">
                <select className="form-select" aria-label="Default select example" onChange={filtrarNotas}>
                    <option value={"all"}>Seleccione Mes</option>
                    <option value={0}>Enero</option>
                    <option value={1}>Febrero</option>
                    <option value={2}>Marzo</option>
                    <option value={3}>Abril</option>
                    <option value={4}>Mayo</option>
                    <option value={5}>Junio</option>
                    <option value={6}>Julio</option>
                    <option value={8}>Agosto</option>
                    <option value={7}>Septiembre</option>
                    <option value={9}>Octubre</option>
                    <option value={10}>Noviembre</option>
                    <option value={11}>Diciembre</option>
                </select>
            </div>
        </>
    )
}

export default FiltroNotas;