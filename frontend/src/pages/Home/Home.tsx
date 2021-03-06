import React from 'react';
import {FiLogIn} from 'react-icons/fi'
import { Link } from 'react-router-dom';

import logo from '../../assets/logo.svg';
import './Home.css';

const Home = () => {
    return (
        <div id= "page-home">
            <div className="content" >
              <header>
                 <img src={logo} alt="Ecoleta" />
              </header>

              <main>
                  <h1>Seu marketplace de cole de residuos.</h1>
                  <p>Ajudamos pessoasa encortratrem ponts de colela de refroma eficiente.</p>
                  <Link to="/create-point">
                      <span>
                          <FiLogIn />
                      </span>
                      <strong>Cadastre um ponto de coleta</strong>
                  </Link>

              </main>
            </div>
        </div>
    )
}

export default Home;