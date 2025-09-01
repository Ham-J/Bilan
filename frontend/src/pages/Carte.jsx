import logo from '../assets/img/logo.png';

export default function Carte(){ 
    return (
        <div className="container-carte py-4">
             <img src={logo} alt="illustration de notre logo" />
            <h1>Notre carte</h1>
            <h2>Les entrées</h2>
            <ol>
                <li>Lorem ipsum dolor sit amet. 15 €</li>
                <li>Lorem ipsum dolor sit amet. 14 € </li>
                
            </ol>
            <h2>Les plats</h2>
            <ol>
                <li>Lorem ipsum dolor sit amet. 23€</li>
                <li>Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet. 30€</li>
                <li>Lorem ipsum dolor sit amet. 26€</li>
            </ol>
            <h2>Les desserts</h2>
            <ol>
                <li>Lorem ipsum dolor sit amet. 12€ </li>
                <li>Lorem ipsum dolor sit amet. 14€</li>
                
            </ol>
        </div>
    ); 
}
