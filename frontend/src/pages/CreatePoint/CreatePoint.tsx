import React, { useEffect, useState, ChangeEvent, FormEvent} from 'react';
import logo from '../../assets/logo.svg';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import './CreatePoint.css';

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGEUFCityResponse {
    nome: string;
}

const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs ] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
    const [InicialPosition, setInicialPosition] = useState<[number, number]>([0,0]);
    const [selectedItems, SetSelectedItems] = useState<number[]>([]);

    const [formData, setFormData] = useState({
        name:'',
        email:'',
        whatsapp:''
    });

    const history = useHistory();

    useEffect(() =>{
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInicialPosition([latitude,longitude]);
        })
    }, []);

    useEffect(() =>{
        api.get('items').then(res => {
            setItems(res.data);
        });
    }, []);

    useEffect(() =>{
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
            const ufInitials = res.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        });
    }, []);

    useEffect(() =>{

        if (selectedUf ==='0'){
            return; 
        }

        axios.get<IBGEUFCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(res => {
            const cityNames = res.data.map(city => city.nome);
            setCities(cityNames);
        });

    }, [selectedUf]);



    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    }

    function handleImputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;
        setFormData({...formData, [name]: value});
    }

    function handleSelectedItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >=0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            SetSelectedItems(filteredItems);
        }else {
            SetSelectedItems([ ...selectedItems, id ]);
        }
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        };

        await api.post('points', data);

        alert(`ponto de coleta: ${data.name} criado com sucesso!`);
        history.push('/');
    }

    return (
      <div id="page-create-point">
          <header>
            <img src={logo} alt="Ecoleta" />
            <Link to="/">
                <FiArrowLeft />
                Voltar para home
            </Link>
          </header>

          <form onSubmit={handleSubmit}>
              <h1>Cadastro do <br/> ponto de coleta</h1>
              <fieldset>
                  <legend>
                      <h2>Dados</h2>
                  </legend>
                  <div className="field">
                      <label htmlFor="name">Home da entidade</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={handleImputChange}
                      />
                  </div>

                  <div className="field-group">
                    <div className="field">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleImputChange}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="whatsapp">WhatsApp</label>
                        <input
                            type="text"
                            name="whatsapp"
                            id="whatsapp"
                            onChange={handleImputChange}
                        />
                    </div>

                  </div>
              </fieldset>
              <fieldset>
                  <legend>
                      <h2>Endereco</h2>
                      <span>Selecione o endereco no mapa</span>
                  </legend>

                  <Map center={InicialPosition} zoom={15} onClick={handleMapClick}>
                  <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  <Marker position={selectedPosition} />
                  </Map>

                  <div className="field-group">
                    <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                <option value="0">Selecione um Estado</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                    </div>
                    <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" value={selectedCity} onChange={handleSelectCity} id="city">
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        
                  </div>
              </fieldset>
              <fieldset>
                  <legend>
                      <h2>Itens de coleta</h2>
                      <span>Selecione um ou mais item abaixo</span>
                  </legend>
                
                <ul className="items-grid">
                    {items.map(item => (
                        <li key={item.id} 
                            onClick={()=> handleSelectedItem(item.id)}
                            className={selectedItems.includes(item.id) ? 'selected' : ''}>
                             <img src={item.image_url} alt={item.title} />
                             <span>{item.title}</span> 
                         </li>
                    ))}
            
                </ul>
              </fieldset>
              <button type="submit">Cadastrar ponto de coleta</button>
          </form>
          
      </div>
    );
}

export default CreatePoint;