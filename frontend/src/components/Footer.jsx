export default function Footer() {
  return (
    <footer className="mt-5">
        <div className="container">
            <div>
                <ol>
                    <li>Le château</li>
                    <li>25 rue john Doe</li>
                    <li>00000 Lorem</li>
                    <li>0300000000</li>
                </ol>
            </div>
             <div>
                <ol>
                    <li><a href="/">Accueil</a></li>
                    <li><a href="/carte">Notre carte</a></li>
                    <li><a href="/reservation">Réservation</a></li>
                    <li><a href="/login">Connexion</a></li>
                </ol>
            </div>
            <div>
                <ol>
                    <li>Mentions légales</li>
                    <li>Données personnelles</li>
                    <li>Accessibilité</li>
                    <li>Cookie</li>
                </ol>
            </div>
        </div>
    </footer>
  );
}
