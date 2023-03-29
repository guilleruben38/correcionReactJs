import { addDoc, collection, getFirestore } from "firebase/firestore"
import { useState } from "react"
import { useCartContext } from "../../context/CartContext"

const CartContainer = () => {
    const [formData, setFormData] = useState ({
        name: '',
        phone:'',
        email:'',
        repetirEmail:'',
    })

    const [mostrarId, setMostrarId] = useState ('')
    const { cartList, vaciarCarrito, precioTotal, eliminarProducto } = useCartContext()  
    
    const validarFormulario = () => {
        if (!formData.name || !formData.phone || !formData.email || !formData.repetirEmail) {
            return window.alert ('Es necesario llenar todos los campos');
        }
        if (formData.email !== formData.repetirEmail) {
            return window.alert ('Los emails no coinciden!!');
        }
        return true;
    }

    const insetarOrder = (e) => {   
        e.preventDefault();
        if (!validarFormulario()) {
            return;
        }
        const order = {}
        order.buyer = formData
        order.isActive = true
        order.productos = cartList.map (({id, name, precio}) => ({id, name, precio}))
        order.total = ''

        const db = getFirestore()
        const ordersCollection = collection (db, 'orders')

        addDoc (ordersCollection, order)
             .then (resp => alert (`Tu ID de compra es: ${resp.id}`))
             .catch (err => console.log (err))
             .finally (()=>{    
                vaciarCarrito()
                setFormData({
                    name: '',
                    phone:'',
                    email:'',
                    repetirEmail:'',
                })
             })
    }
    
    const handleOnChange = (e) =>{
        setFormData ({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    if (cartList.length === 0) {
        return (
            <center>
            <div>
                <h1 >CARRITO VACIO</h1>
                <button className="btn btn-success" style={{
                    marginTop:'10px',
                    color:'black'}} onClick={() => window.location.href='/'}>Volver al inicio</button>
            </div>
            </center>
        )
    }
    

    return (
        <div> 
            <div style={{textAlign:'center'}}>
                <form action="" onSubmit={insetarOrder}>
                    <input
                        type="text"
                        name="name" 
                        placeholder="Nombre"  
                        onChange={handleOnChange} 
                        value={formData.name} 
                        style={{width:'500px', fontSize:'20px', borderRadius:'15px'}}
                    /><br /><br /> 

                    <input 
                        type="text"
                        name="phone"
                        placeholder="Telefono" 
                        onChange={handleOnChange}
                        value={formData.phone}
                        style={{width:'500px', fontSize:'20px', borderRadius:'15px'}}
                    /><br /><br /> 

                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        onChange={handleOnChange}
                        value={formData.email}
                style={
                    {width:'500px', 
                    fontSize:'20px', 
                    borderRadius:'15px'}}/><br /><br /> 

                <input
                type="text"
                name="repetirEmail"
                placeholder="Validar Email"
                onChange={handleOnChange}
                value={formData.repetirEmail}
                style={
                    {width:'500px', 
                    fontSize:'20px', 
                    borderRadius:'15px'}}/><br /><br /> 
               
                 <button 
                 className="btn btn-success"
                 type="submit"
                 onClick={insetarOrder}
                 style={{
                    marginTop:'10px',
                    color:'black'}}
                    >Generar ID de compra</button>

           

             </form>
             </div>

            { cartList.map(producto => (
				<div style={{
					textAlign:'center',
					color:'black',
					fontSize:'25px',
					marginTop:'7px',
					
					
				 }} key={producto.id}>

                
                    <img src={producto.imagen} style={{width: 100}} />
                    *-{producto.name} - Unidad/s: {producto.cantidad} -  ${producto.precio}
					{'-'} <button className="btn btn-danger" onClick={()=> eliminarProducto(producto.id)} > X </button>
                
				</div>
                  
            ))}
            <p
			    style={{
                     textAlign:'center',
                     marginLeft:'620px',
                     color:'black',
                     fontSize:'25px',
                     marginTop:'7px',
                  }}> {precioTotal() !== 0 && `Total :$${precioTotal()}` }  </p>





<div style={{textAlign:'center',
                marginRight:'450px',}}>
    <button className="btn btn-danger" style={{color:'black'}} onClick={vaciarCarrito}>Vaciar Carrito</button>
    </div>
        </div>
    )
}


export default CartContainer